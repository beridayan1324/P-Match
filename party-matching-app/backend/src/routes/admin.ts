import { Router } from 'express';
import authenticate from '../middleware/auth';
import isAdmin from '../middleware/isAdmin';
import { getManagers, approveManager, deleteUser } from '../controllers/adminController';

const router = Router();

// All routes require admin access
router.use(authenticate, isAdmin);

router.get('/managers', getManagers);
router.post('/managers/:userId/approve', approveManager);
router.delete('/users/:userId', deleteUser);

export default router;
