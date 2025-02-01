/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/AppError';
import { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredUserRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req?.headers['authorization'];

    if (authHeader && !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Access token missing or invalid',
        '',
      );
    }

    const token = authHeader?.split(' ')[1];

    //check if token exists in header
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED', '');
    }
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err: any) {
      throw new AppError(StatusCodes.UNAUTHORIZED, err, '');
    }

    const { email } = decoded;

    const user = await User.isUserExistsByEmail(email);

    //check if the user exists
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, 'User is not found!', '');
    }

    const isBlocked = user.isBlocked;

    //check if the user exists
    if (isBlocked) {
      throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked!', '');
    }

    const role = user?.role;

    //check if loggedInUser-role matches with required role
    if (requiredUserRole && !requiredUserRole.includes(role)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED', '');
    }

    (req as any).user = decoded as JwtPayload;
    next();
  });
};

export default auth;
