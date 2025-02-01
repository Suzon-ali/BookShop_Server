/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: 0 },
    passwordChangedAt: {type: Date},
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
      default: 'user',
    },
    isBlocked: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

//middlewares
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//statics
userSchema.statics.isUserExistsByEmail = async function (email) {
  const existingUser = await User.findOne({
    email: { $regex: email, $options: 'i' },
  }).select('+password');
  return existingUser;
};

userSchema.statics.isUserExistsById = async function (id) {
  const existingUser = await User.findOne({
    _id: id,
  });
  return existingUser;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
