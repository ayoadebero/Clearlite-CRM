import { AppDataSource } from '../config/database';
import { Customer } from '../entities/Customer.entity';
import { Call } from '../entities/Call.entity';

export class CustomerService {
    private customerRepository = AppDataSource.getRepository(Customer);
    private callRepository = AppDataSource.getRepository(Call);

    async getAllCustomers(userRole: string, userId: string) {
        const query = this.customerRepository.createQueryBuilder('customer')
            .leftJoinAndSelect('customer.calls', 'calls')
            .orderBy('customer.createdAt', 'DESC');

        // Inputers only see what they created or approved ones? 
        // Usually inputers can see everything but only edit pending?
        // Let's say everyone sees approved.
        // Authorizers/Admins see pending.
        // Inputers see their own pending.

        if (userRole === 'inputer') {
            query.where('customer.approvalStatus = :approved', { approved: 'approved' })
                .orWhere('customer.createdBy = :userId', { userId });
        } else if (userRole === 'user') {
            query.where('customer.approvalStatus = :approved', { approved: 'approved' });
        }
        // Admin and Authorizer see all (including pending)

        return await query.getMany();
    }

    async getPendingCustomers() {
        return await this.customerRepository.find({
            where: { approvalStatus: 'pending' },
            order: { createdAt: 'DESC' },
            relations: ['calls']
        });
    }

    async approveCustomer(id: string) {
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer) throw new Error('Customer not found');
        customer.approvalStatus = 'approved';
        return await this.customerRepository.save(customer);
    }

    async rejectCustomer(id: string) {
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer) throw new Error('Customer not found');
        customer.approvalStatus = 'rejected';
        return await this.customerRepository.save(customer);
    }

    async getCustomerById(id: string) {
        return await this.customerRepository.findOne({
            where: { id },
            relations: ['calls']
        });
    }

    async createCustomer(data: Partial<Customer>, userRole: string, userId: string) {
        const customer = this.customerRepository.create({
            ...data,
            createdBy: userId,
            approvalStatus: (userRole === 'admin' || userRole === 'authorizer') ? 'approved' : 'pending'
        });
        return await this.customerRepository.save(customer);
    }

    async updateCustomer(id: string, updates: Partial<Customer>) {
        const customer = await this.customerRepository.findOne({ where: { id } });
        if (!customer) {
            throw new Error('Customer not found');
        }
        Object.assign(customer, updates);
        return await this.customerRepository.save(customer);
    }

    async deleteCustomer(id: string) {
        const result = await this.customerRepository.delete(id);
        return result.affected !== 0;
    }

    async addCall(customerId: string, callData: Partial<Call>) {
        const customer = await this.customerRepository.findOne({ where: { id: customerId } });
        if (!customer) {
            throw new Error('Customer not found');
        }

        const call = this.callRepository.create({
            ...callData,
            customer
        });

        return await this.callRepository.save(call);
    }
}
