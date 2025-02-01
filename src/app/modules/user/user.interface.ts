/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  role: 'admin' | 'user';
  isBlocked: boolean;
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
