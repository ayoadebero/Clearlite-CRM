import { Router } from 'express';
import { CustomerController } from '../controllers/customers.controller';
import { authenticate, requireAuthorizer } from '../middleware/auth.middleware';

const router = Router();
const customerController = new CustomerController();

router.use(authenticate);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.post('/:id/calls', customerController.addCall);

// Approval routes
router.post('/:id/approve', requireAuthorizer, customerController.approveCustomer);
router.post('/:id/reject', requireAuthorizer, customerController.rejectCustomer);

export default router;
