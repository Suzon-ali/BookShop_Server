import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidationSchemas } from './user.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidationSchemas.UserRegistrationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
