import { Router } from 'express';
import {
  getPreviewInfo,
  getBabyWeekInfo,
  getMomWeekInfo,
  getUserDashboard,
} from '../controllers/weeksController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/weeks/preview', getPreviewInfo);
router.get('/weeks/baby/:week', authenticate, getBabyWeekInfo);
router.get('/weeks/mom/:week', authenticate, getMomWeekInfo);
router.get('/weeks/dashboard', authenticate, getUserDashboard);

export default router;
