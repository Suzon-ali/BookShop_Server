/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TBlog = {
  title: string;
  content: string;
  author?: Types.ObjectId;
  isPublished?: boolean;
  isDeleted?: boolean;
};

export interface BlogModel extends Model<TBlog> {
  isBlogExistById(id: string): Promise<TBlog | null>;
}
