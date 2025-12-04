import api from './api';
import type { Customer } from '../types';

export const getCustomers = async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

export const createCustomer = async (data: Partial<Customer>): Promise<Customer> => {
    const response = await api.post('/customers', data);
    return response.data;
};

export const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
    await api.delete(`/customers/${id}`);
    return true;
};

export const approveCustomer = async (id: string): Promise<Customer> => {
    const response = await api.post(`/customers/${id}/approve`);
    return response.data;
};

export const rejectCustomer = async (id: string): Promise<Customer> => {
    const response = await api.post(`/customers/${id}/reject`);
    return response.data;
};
