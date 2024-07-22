import { Router } from 'express';
import { 
    getProfile, 
    editProfile, 
    changePassword, 
    requestPasswordReset,
    resetPassword
} from '../controllers/profile.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';


const router = Router();

/**
 * Profile routes
 */
router.get('/profiles/:userId', getProfile);
router.put('/profiles/:userId', authenticateJWT, editProfile);
router.put('/profiles/:userId/password', authenticateJWT, changePassword);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password', resetPassword);


export default router;