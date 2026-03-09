import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { celebrate } from 'celebrate';
import {
  createDiaryNote,
  getNotes,
  deleteNote,
  updateNote,
} from '../controllers/diaryControllers.js';
import { NewNoteValidationSchema } from '../validations/diaryValidation.js';

const router = Router();

router.post(
  '/diaries/new',
  authenticate,
  celebrate(NewNoteValidationSchema),
  createDiaryNote,
);

/**
 * @swagger
 *
 * /diaries/all:
 *   get:
 *    summary:
 *    description:
 *    responses:
 */

router.get('/diaries/all', authenticate, getNotes);

router.delete('/diaries/:noteId', authenticate, deleteNote);

router.patch('/diaries/:noteId', authenticate, updateNote);

export default router;
