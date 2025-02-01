import express from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchemas } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(userValidationSchemas.userValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
