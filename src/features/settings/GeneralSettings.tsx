import React, { useState, useEffect } from 'react';
import { getAppSettings, saveAppSettings, clearAllData } from '../../services/userStorage';
import type { AppSettings } from '../../types';

const GeneralSettings: React.FC = () => {
    const [settings, setSettings] = useState<AppSettings>({
        companyName: '',
        version: '',
        autoSave: true
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setSettings(getAppSettings());
    }, []);

    const handleSave = () => {
        saveAppSettings(settings);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all data? This will reset the app to default state and you will be logged out.')) {
            clearAllData();
            alert('Data cleared successfully. Please refresh the page.');
            window.location.href = '/login';
        }
    };

    const handleExportData = () => {
        const data = {
            users: localStorage.getItem('clearlite_crm_users'),
            settings: localStorage.getItem('clearlite_crm_app_settings'),
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clearlite-crm-backup-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-lg)' }}>Application Settings</h3>

                {success && (
                    <div style={{
                        padding: 'var(--space-sm)',
                        background: 'rgba(63, 185, 80, 0.1)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--success)',
                        marginBottom: 'var(--space-md)',
                        fontSize: '0.875rem'
                    }}>
                        ✓ Settings saved successfully
                    </div>
                )}

                <div className="login-form" style={{ gap: 'var(--space-lg)' }}>
                    <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            value={settings.companyName}
                            onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="version">Version</label>
                        <input
                            id="version"
                            type="text"
                            value={settings.version}
                            disabled
                            style={{ opacity: 0.6 }}
                        />
                        <small className="text-xs text-muted">Read-only</small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                        <input
                            id="autoSave"
                            type="checkbox"
                            checked={settings.autoSave}
                            onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                        />
                        <label htmlFor="autoSave" style={{ margin: 0, cursor: 'pointer' }}>
                            Enable Auto-Save
                        </label>
                    </div>

                    <button className="btn-primary" onClick={handleSave} style={{ marginTop: 'var(--space-md)' }}>
                        Save Settings
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
                <h3 style={{ marginBottom: 'var(--space-md)' }}>Data Management</h3>
                <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                    Export or clear your application data. Be careful with these actions.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    <button
                        className="btn-primary"
                        onClick={handleExportData}
                        style={{ background: 'var(--success)' }}
                    >
                        Export Data (JSON)
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleClearData}
                        style={{ background: 'var(--danger)' }}
                    >
                        Clear All Data
                    </button>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-md)' }}>About</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    <div className="text-sm">
                        <span className="text-muted">Application:</span> Clearlite CRM
                    </div>
                    <div className="text-sm">
                        <span className="text-muted">Version:</span> {settings.version}
                    </div>
                    <div className="text-sm">
                        <span className="text-muted">Storage:</span> localStorage (Client-side)
                    </div>
                    <div className="text-sm">
                        <span className="text-muted">Status:</span> <span style={{ color: 'var(--success)' }}>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
