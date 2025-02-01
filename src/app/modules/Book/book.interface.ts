/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TBook = {
  title: string;
  author: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  coverImage?: string;
  isDeleted?: boolean;
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export interface BookModel extends Model<TBook> {
  isBookExistById(id: string): Promise<TBook | null>;
}
