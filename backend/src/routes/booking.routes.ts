import { Router } from 'express';
import { 
    create, 
    getRecent, 
    cancel, 
    verify, 
    update, 
    getForEvent, 
    getById,
    getUserBookingsController
} from '../controllers/booking.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { Role } from '../interfaces/user.interfaces';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();

/**
 * Booking routes
 */
router.post('/bookings', authenticateJWT, create);
router.get('/bookings', authenticateJWT , getRecent);
router.delete('/bookings/:id', authenticateJWT, cancel);
router.get('/bookings/verify/:ticketCode', verify);
router.put('/bookings/:id', authenticateJWT, update);
router.get('/bookings/user', authenticateJWT, getUserBookingsController);
router.get('/bookings/:id', authenticateJWT, getById);
router.get('/bookings/event/:eventId', authenticateJWT, authorizeRole(Role.MANAGER),getForEvent);

export default router;
