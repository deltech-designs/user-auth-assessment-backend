import { Router } from 'express';
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  logoutUser,
  getUserProfile,
} from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  registerValidation,
  loginValidation,
} from '../middlewares/validation.js';

const router = Router();

router
  .route('/register')
  .post(registerValidation, validateRequest, registerUser);
router.route('/verify-email/:token').get(verifyEmail);
router.route('/resend-verification').post(resendVerificationEmail);
router.route('/login').post(loginValidation, validateRequest, loginUser);
router.route('/logout').post(logoutUser);
router.route('/profile').get(getUserProfile);

export default router;
