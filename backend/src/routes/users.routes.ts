import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Protected routes
router.use(authenticate);

// Admin only routes
router.get('/', requireAdmin, userController.getAllUsers);
router.post('/', requireAdmin, userController.createUser);
router.delete('/:id', requireAdmin, userController.deleteUser);
router.post('/:id/reset-password', requireAdmin, userController.resetPassword);

// User routes (self or admin)
router.put('/:id', userController.updateUser); // Should add check for self-update
router.post('/change-password', userController.changePassword);

export default router;
