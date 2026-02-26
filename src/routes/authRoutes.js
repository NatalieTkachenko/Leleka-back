import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
} from '../controllers/authController.js';
import { celebrate } from 'celebrate';
import {
  loginUserValidationSchema,
  registerUserValidationSchema,
  RequestResetEmailSchema,
} from '../validations/authValidation.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/auth/register',
  celebrate(registerUserValidationSchema),
  registerUser,
);

router.post('/auth/login', celebrate(loginUserValidationSchema), loginUser);
router.post('/auth/refresh', authenticate, refreshUserSession);
router.post('/auth/logout', authenticate, logoutUser);
router.post(
  '/auth/request-reset-email',
  celebrate(RequestResetEmailSchema),
  requestResetEmail,
  //   перевірить email користувача,
  // згенерує JWT-токен,
  // відправить лист із посиланням для скидання паролю.
);
// router.post(
//   '/auth/reset-password',
//   //   прийматиме токен і новий пароль,
//   // перевірятиме токен,
//   // оновлюватиме пароль користувача.
// );

export default router;
