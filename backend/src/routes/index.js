import { Router } from 'express';
import authRoutes from './auth.routes.js';
import filmesRoutes from './filmes.routes.js';

const router = Router();
router.use('/api', authRoutes);
router.use('/api', filmesRoutes);
router.get('/hello', (req, res) => (res.send('Hello World!')));
export default router;