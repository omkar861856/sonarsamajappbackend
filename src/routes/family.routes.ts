import { Router } from 'express';
import { getFamilies, createFamily } from '../controllers/family.controller.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', getFamilies);
router.post('/', auth, createFamily);

export default router;
