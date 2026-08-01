import { Router } from 'express';
import { translateForm } from '../controllers/gemini.controller.js';

const router = Router();

router.post('/translate-form', translateForm);

export default router;
