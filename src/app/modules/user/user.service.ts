import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = (payload: TUser) => {
  const newUser = new User(payload);
  const result = newUser.save();
  return result;
};

export const UserServices = {
  createUserIntoDB,
};
