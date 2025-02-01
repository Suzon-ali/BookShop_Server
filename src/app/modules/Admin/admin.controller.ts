import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Blog } from '../blog/blog.model';
import { User } from '../user/user.model';
import { AdminServices } from './admin.services';

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.userId;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid userId!', '');
  }

  //fetch user
  const user = await User.isUserExistsById(id);

  // Check if the user is exist
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found', '');
  }
  // Check if the user is already blocked
  if (user && user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is already blocked!', '');
  }
  const result = await AdminServices.blockUserFromDB(id);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User blocked successfully!',
      data: null,
    });
  }
});

const deleteBlogByAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  // Check if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid userId!', '');
  }
  // Check if the user is exist
  if (!(await Blog.isBlogExistById(id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found', '');
  }

  const result = await AdminServices.deleteBlogByAdminFromDB(id);

  if (result) {
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Blog deleted successfully!',
      data: null,
    });
  }
});

export const AdminControllers = {
  blockUser,
  deleteBlogByAdmin,
};
