import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/userStorage';
import '../styles/components.css';

interface ChangePasswordProps {
    isOpen: boolean;
    onClose?: () => void;
    forced?: boolean; // If true, user cannot close modal
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ isOpen, onClose, forced = false }) => {
    const { currentUser, updateCurrentUser, login } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!isOpen || !currentUser) return null;

    const validatePassword = (password: string): string | null => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[0-9]/.test(password)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate new password
        const validationError = validatePassword(newPassword);
        if (validationError) {
            setError(validationError);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword === currentPassword) {
            setError('New password must be different from current password');
            return;
        }

        try {
            // Change password
            const success = await changePassword(currentPassword, newPassword);

            if (success) {
                setSuccess(true);
                updateCurrentUser({ mustChangePassword: false });

                // Re-login with new password to update state
                await login(currentUser.email, newPassword);

                setTimeout(() => {
                    setSuccess(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    if (onClose) onClose();
                }, 1500);
            } else {
                setError('Current password is incorrect');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
        }
    };

    const handleClose = () => {
        if (!forced && onClose) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay open">
            <div className="modal-content" style={{ width: '500px' }}>
                <div style={{ padding: 'var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-sm)' }}>
                        {forced ? 'Change Your Password' : 'Update Password'}
                    </h3>
                    {forced && (
                        <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                            For security reasons, you must change your password before continuing.
                        </p>
                    )}

                    {success ? (
                        <div style={{
                            padding: 'var(--space-lg)',
                            background: 'rgba(63, 185, 80, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--success)',
                            textAlign: 'center'
                        }}>
                            ✓ Password changed successfully!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="error-message">{error}</div>
                            )}

                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <small className="text-xs text-muted">
                                    Must be 6+ characters with uppercase and number
                                </small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
                                {!forced && (
                                    <button type="button" className="icon-btn" onClick={handleClose} style={{ flex: 1 }}>
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    Change Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
