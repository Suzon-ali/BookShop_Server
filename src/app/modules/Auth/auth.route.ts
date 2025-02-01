import express from 'express';
import { AuthContollers } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidationSchemas } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidationSchemas.loginValidationSchema),
  AuthContollers.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidationSchemas.refreshTokenValidationSchema),
  AuthContollers.refreshToken,
);

router.post(
  '/forget-password',
  validateRequest(AuthValidationSchemas.forgetPasswordValidationSchema),
  AuthContollers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthValidationSchemas.resetPasswordValidationSchema),
  AuthContollers.resetPassword,
);

export const AuthRoutes = router;
