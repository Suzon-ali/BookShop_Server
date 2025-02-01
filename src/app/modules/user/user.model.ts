/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../../config';
import { TUser, UserModel } from './user.interface';

interface ICartItem {
  productId: string;
  quantity: number;
}

interface IOrder {
  orderId: string;
  products: ICartItem[];
  totalAmount: number;
  orderDate: Date;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true },
  products: { type: [CartItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    required: true,
  },
});

const UserSchema = new Schema<TUser>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true,
      default: 'user',
    },
    isBlocked: { type: Boolean, default: false },
    cart: { type: [CartItemSchema], default: [] },
    orders: { type: [OrderSchema], default: [] },
    wishlist: { type: [String], default: [] },
  },
  { timestamps: true },
);

//middlewares
UserSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//statics
UserSchema.statics.isUserExistsByEmail = async function (email) {
  const existingUser = await User.findOne({
    email: { $regex: email, $options: 'i' },
  }).select('+password');
  return existingUser;
};

UserSchema.statics.isUserExistsById = async function (id) {
  const existingUser = await User.findOne({
    _id: id,
  });
  return existingUser;
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', UserSchema);
