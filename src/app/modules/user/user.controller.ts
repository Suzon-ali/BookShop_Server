import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { v4 as uuidv4 } from 'uuid';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const paylod = req.body;
  const user = { ...paylod, id: uuidv4() };
  const result = await UserServices.createUserIntoDB(user);

  sendResponse(res, {
    success: true,
    message: 'User created succesfully!',
    statusCode: StatusCodes.CREATED,
    data: {
      id: result?.id,
      name: result?.name,
      email: result?.email,
    },
  });
});

export const UserControllers = {
  createUser,
};
