import express from 'express';
import auth from '../../middlewares/auth';
import { AdminControllers } from './admin.controller';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.patch(
  '/users/:userId/block',
  auth(USER_ROLE.admin),
  AdminControllers.blockUser,
);
router.delete(
  '/books/:id',
  auth(USER_ROLE.admin),
  AdminControllers.deleteBookByAdmin,
);

export const AdminRoutes = router;
