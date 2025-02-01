import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await UserServices.createUserIntoDB(user);

  sendResponse(res, {
    success: true,
    message: 'User created succesfully!',
    statusCode: StatusCodes.CREATED,
    data: {
      _id: result._id,
      name: result.name,
      email: result.email,
    },
  });
});

export const UserControllers = {
  createUser,
};
