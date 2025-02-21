import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const user = req.body;
  const result = await AuthServices.loginUserIntoDB(user);

  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'development',
    httpOnly: true,
  });

  sendResponse(res, {
    success: true,
    message: 'User logged in succesfully!',
    statusCode: StatusCodes.OK,
    data: { token: accessToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const refreshToken =
    req.cookies.refreshToken || req.headers['x-refresh-token'];
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    success: true,
    message: 'AccessToken is created succesfully!',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const body = req?.body;
  const { email } = body;
  const result = await AuthServices.forgetPassword(email);

  sendResponse(res, {
    success: true,
    message: 'Reset password link has been sent to your email',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const accessToken = req?.headers?.authorization;
  const payload = req?.body;
  const { password } = payload;

  const result = await AuthServices.resetePassword(
    accessToken as string,
    password,
  );

  sendResponse(res, {
    success: true,
    message: 'Password reset succesfull',
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const AuthContollers = {
  loginUser,
  refreshToken,
  forgetPassword,
  resetPassword,
};
