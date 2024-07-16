import { Router } from 'express';
import { create, update, getAll, getById, remove } from '../controllers/category.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

// Protected routes for category management
router.post('/categories', authenticateJWT, authorizeRole(Role.ADMIN), create);
router.put('/categories/:id', authenticateJWT, authorizeRole(Role.ADMIN), update);
router.get('/categories', getAll);
router.get('/categories/:id', getById);
router.delete('/categories/:id', authenticateJWT, authorizeRole(Role.ADMIN), remove);

export default router;