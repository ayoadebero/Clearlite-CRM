import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../services/userStorage';
import ChangePassword from '../../components/ChangePassword';

const ProfileSettings: React.FC = () => {
    const { currentUser, updateCurrentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || ''
    });
    const [success, setSuccess] = useState(false);

    if (!currentUser) return null;

    const handleSave = () => {
        if (!currentUser) return;

        updateUser(currentUser.id, {
            name: formData.name,
            email: formData.email
        });

        updateCurrentUser({
            name: formData.name,
            email: formData.email
        });

        setIsEditing(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleCancel = () => {
        setFormData({
            name: currentUser.name,
            email: currentUser.email
        });
        setIsEditing(false);
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Profile Information</h3>

                {success && (
                    <div style={{
                        padding: 'var(--space-sm)',
                        background: 'rgba(63, 185, 80, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--success)',
                        marginBottom: 'var(--space-md)',
                        fontSize: '0.875rem'
                    }}>
                        ✓ Profile updated successfully
                    </div>
                )}

                <div className="login-form" style={{ gap: 'var(--space-lg)' }}>
                    <div className="form-group">
                        <label>Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        ) : (
                            <div style={{ padding: 'var(--space-sm)', color: 'var(--text-primary)' }}>
                                {currentUser.name}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        {isEditing ? (
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        ) : (
                            <div style={{ padding: 'var(--space-sm)', color: 'var(--text-primary)' }}>
                                {currentUser.email}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <div style={{ padding: 'var(--space-sm)' }}>
                            <span className={`status-badge status-${currentUser.role === 'admin' ? 'active' : 'lead'}`}>
                                {currentUser.role}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Account Status</label>
                        <div style={{ padding: 'var(--space-sm)' }}>
                            <span className={`status-badge status-${currentUser.status}`}>
                                {currentUser.status}
                            </span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Member Since</label>
                        <div style={{ padding: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                            {new Date(currentUser.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    {currentUser.lastLogin && (
                        <div className="form-group">
                            <label>Last Login</label>
                            <div style={{ padding: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                                {new Date(currentUser.lastLogin).toLocaleString()}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                        {isEditing ? (
                            <>
                                <button className="icon-btn" onClick={handleCancel} style={{ flex: 1 }}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button className="btn-primary" onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Security</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                    Update your password to keep your account secure.
                </p>
                <button className="btn-primary" onClick={() => setShowPasswordModal(true)}>
                    Change Password
                </button>
            </div>

            <ChangePassword
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                forced={false}
            />
        </div>
    );
};

export default ProfileSettings;
