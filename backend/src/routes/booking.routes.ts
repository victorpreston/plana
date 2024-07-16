import { Router } from 'express';
import { 
    create, 
    getRecent, 
    cancel, 
    verify, 
    update, 
    getForEvent, 
    getById
} from '../controllers/booking.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { Role } from '../interfaces/user.interfaces';
import { authorizeRole } from '../middleware/role.middleware';

const router = Router();

// Protected routes for booking management
router.post('/bookings', authenticateJWT, create);
router.get('/bookings', authenticateJWT, getRecent);
router.delete('/bookings/:id', authenticateJWT, cancel);
router.get('/bookings/verify/:ticketCode', verify);
router.put('/bookings/:id', authenticateJWT, update);
router.get('/bookings/:id', authenticateJWT, getById); // Added route to get booking by ID
router.get('/bookings/event/:eventId', authenticateJWT, authorizeRole(Role.MANAGER),getForEvent);

export default router;
