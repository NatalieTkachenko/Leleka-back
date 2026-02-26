import express from 'express';
import { celebrate } from 'celebrate';
import {
  getCurrentUser,
  updateUserAvatar,
  updateUser,
} from '../controllers/usersController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { userUpdateSchema } from '../validations/userUpdateValidation.js';

const router = express.Router();

router.get('/users/me', authenticate, getCurrentUser);
router.patch(
  '/users/me/avatar',
  authenticate,
  upload.single('avatar'),
  updateUserAvatar,
);

router.patch(
  '/users/me',
  authenticate,
  celebrate(userUpdateSchema),
  updateUser,
);

export default router;
