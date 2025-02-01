import { Blog } from '../blog/blog.model';
import { User } from '../user/user.model';

const blockUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate({ _id: id }, { isBlocked: true });
  return result;
};

const deleteBlogByAdminFromDB = async (id: string) => {
  const result = await Blog.findByIdAndUpdate({ _id: id }, { isDeleted: true });

  return result;
};

export const AdminServices = {
  blockUserFromDB,
  deleteBlogByAdminFromDB,
};
