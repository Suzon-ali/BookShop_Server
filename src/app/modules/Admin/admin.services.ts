import { Book } from '../Book/book.model';
import { User } from '../User/user.model';

const blockUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { isBlocked: true });
  return result;
};

const deleteBookByAdminFromDB = async (id: string) => {
  const result = await Book.findByIdAndUpdate({ _id: id }, { isDeleted: true });

  return result;
};

export const AdminServices = {
  blockUserFromDB,
  deleteBookByAdminFromDB,
};
