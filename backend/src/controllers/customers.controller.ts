import { Request, Response } from 'express';
import { CustomerService } from '../services/customers.service';

export class CustomerController {
    private customerService = new CustomerService();

    getAllCustomers = async (req: Request, res: Response) => {
        try {
            const user = req.user!;
            const customers = await this.customerService.getAllCustomers(user.role, user.id);
            return res.json(customers);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    getCustomerById = async (req: Request, res: Response) => {
        try {
            const customer = await this.customerService.getCustomerById(req.params.id);
            if (!customer) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            return res.json(customer);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    createCustomer = async (req: Request, res: Response) => {
        try {
            const user = req.user!;
            const customer = await this.customerService.createCustomer(req.body, user.role, user.id);
            return res.status(201).json(customer);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    approveCustomer = async (req: Request, res: Response) => {
        try {
            const customer = await this.customerService.approveCustomer(req.params.id);
            return res.json(customer);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    rejectCustomer = async (req: Request, res: Response) => {
        try {
            const customer = await this.customerService.rejectCustomer(req.params.id);
            return res.json(customer);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    updateCustomer = async (req: Request, res: Response) => {
        try {
            const customer = await this.customerService.updateCustomer(req.params.id, req.body);
            return res.json(customer);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    deleteCustomer = async (req: Request, res: Response) => {
        try {
            const success = await this.customerService.deleteCustomer(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            return res.json({ message: 'Customer deleted successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    addCall = async (req: Request, res: Response) => {
        try {
            const call = await this.customerService.addCall(req.params.id, req.body);
            return res.status(201).json(call);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };
}
