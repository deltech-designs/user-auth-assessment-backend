import { Router } from 'express';
import authRoutes from './userRoutes.js';

const router = Router();

router.use('/auth', authRoutes); // Base path is /api/auth

export default router;
