import { Router } from 'express';
import { create, update, getAll, getById, remove } from '../controllers/event.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

// Public route to get all events
router.get('/events', getAll);

// Public route to get an event by ID
router.get('/events/:id', getById);

// Protected routes for event management
router.post('/events', authenticateJWT, authorizeRole(Role.MANAGER), create);
router.put('/events/:id', authenticateJWT, authorizeRole(Role.MANAGER), update);
router.delete('/events/:id', authenticateJWT, authorizeRole(Role.MANAGER), remove);

export default router;