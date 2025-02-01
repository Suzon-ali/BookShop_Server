import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/AppError';
import { sendEmail } from '../../utils/sendMail';
import { User } from '../user/user.model';
import { TUserLogin } from './auth.interface';
import createToken from './auth.utils';

const loginUserIntoDB = async (payload: TUserLogin) => {
  const user = await User.isUserExistsByEmail(payload?.email);

  //check if it's a valid  user
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found', '');
  }
  //check if it's not blocked user
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked', '');
  }

  //check if password is matched
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Wrong password', '');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    author: user?._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  //check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  //destructure userId and iat from decoded
  const { author } = decoded;

  //now check if the user is exist
  const user = await User.isUserExistsById(author);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found', '');
  }

  //now lets check if the user is blocked
  const isBlocked = user?.isBlocked;

  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked', '');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    author: user?._id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (email: string) => {
  const user = await User.isUserExistsByEmail(email);

  //check if it's a valid  user
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found', '');
  }
  //check if it's not blocked user
  const isBlocked = user.isBlocked;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked', '');
  }

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    author: user?._id,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  );

  const resetUiLink = `${config.reset_password_ui_link}?email=${email}&token=${resetToken}`;
  await sendEmail(email, resetUiLink);
};

const resetePassword = async (accessToken: string, password: string) => {
  const decoded = jwt.verify(
    accessToken,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const { email } = decoded;
  const user = await User.isUserExistsByEmail(email);

  //check if it's a valid  user
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found', '');
  }
  //check if it's not blocked user
  const isBlocked = user?.isBlocked;
  if (isBlocked) {
    throw new AppError(StatusCodes.FORBIDDEN, 'User is blocked', '');
  }

  const newHashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    { email: user?.email },
    { password: newHashedPassword, passwordChangedAt: new Date() },
    { new: true },
  );

  return result;
};

export const AuthServices = {
  loginUserIntoDB,
  refreshToken,
  forgetPassword,
  resetePassword,
};
