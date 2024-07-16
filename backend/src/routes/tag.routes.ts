import { Router } from 'express';
import { create, update, getAll, getById, remove } from '../controllers/tag.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

// Protected routes for tag management
router.post('/tags', authenticateJWT, authorizeRole(Role.MANAGER), create);
router.put('/tags/:id', authenticateJWT, authorizeRole(Role.MANAGER), update);
router.get('/tags', getAll);
router.get('/tags/:id', getById);
router.delete('/tags/:id', authenticateJWT, authorizeRole(Role.MANAGER), remove);

export default router;