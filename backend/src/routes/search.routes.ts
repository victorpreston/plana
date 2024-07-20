import { Router } from 'express';
import { 
  searchForUsers, 
  searchForEvents, 
  searchForBookings, 
  searchForCategories, 
  searchForTags, 
  searchForTickets 
} from '../controllers/search.controllers';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { Role } from '../interfaces/user.interfaces';

const router = Router();

/**
 * Search routes
 */
router.get('/search/users', authenticateJWT, searchForUsers);
router.get('/search/events', searchForEvents);
router.get('/search/bookings', authenticateJWT, searchForBookings);
router.get('/search/categories', authenticateJWT, searchForCategories);
router.get('/search/tags', authenticateJWT, searchForTags);
router.get('/search/tickets', authenticateJWT, searchForTickets);

export default router;
