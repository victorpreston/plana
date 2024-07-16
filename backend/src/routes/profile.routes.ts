import { Router } from 'express';
import { getProfile, editProfile, changePassword } from '../controllers/profile.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';


const router = Router();

// Protected routes
router.get('/profiles/:userId', authenticateJWT, getProfile);
router.put('/profiles/:userId', authenticateJWT, editProfile);
router.put('/profiles/:userId/password', authenticateJWT, changePassword);

export default router;