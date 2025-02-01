/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  phoneNumber?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  cart?: CartItem[];
  orders?: Order[];
  wishlist?: string[];
};

type CartItem = {
  productId: string;
  quantity: number;
};

type Order = {
  orderId: string;
  products: CartItem[];
  totalAmount: number;
  orderDate: Date;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
};

export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserExistsById(id: string): Promise<TUser | null>;
}
