import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from './UserManagement';
import ProfileSettings from './ProfileSettings';
import GeneralSettings from './GeneralSettings';
import '../../styles/components.css';

const Settings: React.FC = () => {
    const { isAdmin } = useAuth();
    const [activeTab, setActiveTab] = useState(isAdmin() ? 'users' : 'profile');

    const tabs = [
        ...(isAdmin() ? [{ id: 'users', label: 'User Management' }] : []),
        { id: 'profile', label: 'Profile' },
        { id: 'general', label: 'General' },
    ];

    return (
        <div className="settings-container">
            <h2 style={{ marginBottom: 'var(--space-lg)' }}>Settings</h2>

            <div className="settings-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="settings-content">
                {activeTab === 'users' && isAdmin() && <UserManagement />}
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'general' && <GeneralSettings />}
            </div>
        </div>
    );
};

export default Settings;
