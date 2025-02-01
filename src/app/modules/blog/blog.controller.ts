/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Blog } from './blog.model';
import { BlogServices } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = (req as any).user;
  const blog = {
    ...req.body,
    author: loggedInUser?.author,
  };
  const result = await BlogServices.creatBlogIntoDB(blog);
  const populatedResult = await result.populate('author');

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Blog created succesfully!',
    data: populatedResult,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog fetched succesfully!',
    data: result,
  });
});

const getBlogLength = catchAsync(async (req: Request, res: Response) => {
  const allBlogLength = await BlogServices.getAllBlogsLengthFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog fetched succesfully!',
    data: allBlogLength,
  });
});

const getSingleBlogById = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getSingleBlogFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog fetched succesfully!',
    data: result,
  });
});

const updateSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const currentUser = (req as any).user;
  const currentBlog = await Blog.findById({ _id: id });

  //check if the id is valid objectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid id!', '');
  }

  //check if it's the same user updating it's own blog
  if (currentUser.author !== currentBlog?.author?.toString()) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'Unauthorized Request! here',
      '',
    );
  }
  const result = await BlogServices.updateBlogIntoDB(id, payload);
  const populatedResult = await result?.populate('author');

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Blog updated succesfully!',
    data: populatedResult,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req?.params?.id;
  const currentUser = (req as any).user;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid ID!', '');
  }

  // Fetch the current blog
  const currentBlog = await Blog.findById({ _id: id });

  // Check if the blog exists
  if (!currentBlog) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Blog not found', '');
  }

  // Check if it's the same user or an authorized admin
  if (currentUser?.author !== currentBlog.author?.toString()) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized Request!', '');
  }

  //ensure blog is deleted
  const result = await BlogServices.deleteBlogFromDB(id);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Blog deleted successfully!',
      data: null,
    });
  }
});

export const BlogControllers = {
  createBlog,
  getAllBlogs,
  updateSingleBlog,
  deleteBlog,
  getSingleBlogById,
  getBlogLength,
};
