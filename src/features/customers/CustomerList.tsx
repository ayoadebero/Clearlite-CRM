import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { getCustomers, createCustomer, approveCustomer, rejectCustomer } from '../../services/customerStorage';
import type { Customer } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components.css';

const CustomerList: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser: user } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCustomer, setNewCustomer] = useState({ name: '', company: '', email: '', phone: '', role: '' });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to load customers', error);
        }
    };

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCustomer(newCustomer);
            setShowAddModal(false);
            setNewCustomer({ name: '', company: '', email: '', phone: '', role: '' });
            loadCustomers();
            alert(user?.role === 'inputer' ? 'Customer added and pending approval.' : 'Customer added successfully.');
        } catch (error) {
            console.error('Failed to add customer', error);
            alert('Failed to add customer');
        }
    };

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await approveCustomer(id);
            loadCustomers();
        } catch (error) {
            console.error('Failed to approve', error);
        }
    };

    const handleReject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await rejectCustomer(id);
            loadCustomers();
        } catch (error) {
            console.error('Failed to reject', error);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canApprove = user?.role === 'admin' || user?.role === 'authorizer';

    return (
        <div>
            <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-lg)' }}>
                <div className="search-bar" style={{ position: 'relative', width: '300px' }}>
                    <Search
                        size={18}
                        className="text-muted"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                </div>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} />
                    Add Customer
                </button>
            </div>

            <div className="customer-list">
                {filteredCustomers.map(customer => (
                    <div
                        key={customer.id}
                        className="customer-item"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                        <div className="customer-info">
                            <h3>{customer.name}</h3>
                            <div className="text-sm text-muted">{customer.company} • {customer.role}</div>
                        </div>
                        <div className="customer-meta">
                            {customer.approvalStatus === 'pending' && (
                                <span className="status-badge status-lead" style={{ marginRight: '10px', background: '#eab308', color: '#fff' }}>
                                    Pending Approval
                                </span>
                            )}
                            <span className={`status-badge status-${customer.status}`}>
                                {customer.status}
                            </span>

                            {customer.approvalStatus === 'pending' && canApprove && (
                                <div className="flex gap-sm" style={{ marginLeft: '10px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '12px', background: '#22c55e' }}
                                        onClick={(e) => handleApprove(e, customer.id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '12px', background: '#ef4444' }}
                                        onClick={(e) => handleReject(e, customer.id)}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            <ChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Customer</h2>
                        <form onSubmit={handleAddCustomer}>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <input
                                    type="text"
                                    value={newCustomer.company}
                                    onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={newCustomer.role}
                                    onChange={e => setNewCustomer({ ...newCustomer, role: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={newCustomer.email}
                                    onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    value={newCustomer.phone}
                                    onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-md mt-4">
                                <button type="submit" className="btn-primary">Save</button>
                                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
