import { Router } from 'express';
import { register, login, getUser, updateRole, getUsers, removeUser } from '../controllers/user.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

/**
 * public routes
 */
router.post('/register', register);
router.post('/login', login);

/**
 * protected routes
 */
router.get('/users', authenticateJWT, authorizeRole(Role.ADMIN), getUsers);
router.get('/users/:id', authenticateJWT, getUser);
router.put('/users/:id/role', authenticateJWT, authorizeRole(Role.ADMIN), updateRole);
router.delete('/users/:id', authenticateJWT, authorizeRole(Role.ADMIN), removeUser);

export default router;