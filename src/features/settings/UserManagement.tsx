import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Key } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, resetUserPassword } from '../../services/userStorage';
import type { User, UserRole, UserStatus } from '../../types';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user' as UserRole,
        status: 'active' as UserStatus
    });

    // Load users from API
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    };

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '', // Never pre-fill password
                role: user.role,
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'user', status: 'active' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                // Update existing user
                const updates: Partial<User> = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    status: formData.status
                };
                if (formData.password) {
                    updates.password = formData.password;
                }
                await updateUser(editingUser.id, updates);
            } else {
                // Create new user
                if (!formData.password) {
                    alert('Password is required for new users');
                    return;
                }
                await createUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    status: formData.status,
                    mustChangePassword: true
                });
            }

            loadUsers();
            closeModal();
        } catch (error: any) {
            alert(error.message || 'Operation failed');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                loadUsers();
            } catch (error: any) {
                alert(error.message || 'Failed to delete user');
            }
        }
    };

    const handleResetPassword = async (user: User) => {
        const newPassword = prompt(`Enter new password for ${user.name}:`);
        if (newPassword) {
            if (newPassword.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            try {
                await resetUserPassword(user.id, newPassword);
                alert(`Password reset successfully. User will be required to change it on next login.`);
                loadUsers();
            } catch (error: any) {
                alert(error.message || 'Failed to reset password');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h3>Users</h3>
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {users.map(user => (
                    <div key={user.id} className="card" style={{ padding: 'var(--space-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{user.name}</div>
                                <div className="text-sm text-muted">{user.email}</div>
                                {user.mustChangePassword && (
                                    <div className="text-xs" style={{ color: 'var(--warning)', marginTop: '4px' }}>
                                        ⚠ Must change password
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <span className={`status-badge status-${user.role === 'admin' ? 'active' : 'lead'}`}>
                                    {user.role}
                                </span>
                                <span className={`status-badge status-${user.status}`}>
                                    {user.status}
                                </span>
                                <button
                                    className="icon-btn"
                                    onClick={() => handleResetPassword(user)}
                                    title="Reset Password"
                                >
                                    <Key size={16} />
                                </button>
                                <button className="icon-btn" onClick={() => openModal(user)}>
                                    <Edit size={16} />
                                </button>
                                <button className="icon-btn" onClick={() => handleDelete(user.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay open">
                    <div className="modal-content" style={{ width: '500px' }}>
                        <div style={{ padding: 'var(--space-lg)' }}>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">
                                        {editingUser ? 'Password (leave blank to keep current)' : 'Password'}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                    />
                                    {!editingUser && (
                                        <small className="text-xs text-muted">
                                            User will be required to change password on first login
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status">Status</label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                                    <button type="button" className="icon-btn" onClick={closeModal} style={{ flex: 1 }}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                        {editingUser ? 'Save Changes' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
