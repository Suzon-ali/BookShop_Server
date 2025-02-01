import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchFields } from './blog.constant';

const creatBlogIntoDB = async (payload: TBlog) => {
  const newBlog = new Blog(payload);
  const result = await newBlog.save();
  return result;
};

const getAllBlogsFromDB = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate('author'), query)
    .search(blogSearchFields.blogSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  return result;
};

const getAllBlogsLengthFromDB = async () => {
  const result = await Blog.find();
  return result.length;
};

const updateBlogIntoDB = async (id: string, payload: Partial<TBlog>) => {
  const result = await Blog.findByIdAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

const deleteBlogFromDB = async (id: string) => {
  const result = await Blog.findByIdAndUpdate({ _id: id }, { isDeleted: true });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found', '');
  }
  return result;
};

const getSingleBlogFromDB = async (id: string) => {
  const result = await Blog.findById({ _id: id }).populate('author');
  return result;
};

export const BlogServices = {
  getAllBlogsFromDB,
  creatBlogIntoDB,
  updateBlogIntoDB,
  deleteBlogFromDB,
  getSingleBlogFromDB,
  getAllBlogsLengthFromDB,
};
