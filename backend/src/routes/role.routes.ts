import { Router } from 'express';
import {
  requestRoleChange,
  approveRoleChange,
  rejectRoleChange,
  getAllRoleChangeRequests,
} from '../controllers/role.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

/**
 * Role change routes
 */
router.post('/roles/request', authenticateJWT, requestRoleChange);
router.put('/roles/approve/:requestId', authenticateJWT, authorizeRole(Role.ADMIN), approveRoleChange);
router.put('/roles/reject/:requestId', authenticateJWT, authorizeRole(Role.ADMIN), rejectRoleChange);
router.get('/roles/requests', authenticateJWT, authorizeRole(Role.ADMIN), getAllRoleChangeRequests);

export default router;