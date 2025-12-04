import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Users, BarChart2, Settings, Bell, Phone, LogOut } from 'lucide-react';
import { useCall } from '../context/CallContext';
import { useAuth } from '../context/AuthContext';
import '../styles/layout.css';

const MainLayout: React.FC = () => {
    const location = useLocation();
    const { openDialer } = useCall();
    const { currentUser, logout } = useAuth();

    const getPageTitle = () => {
        if (location.pathname === '/') return 'Customers';
        if (location.pathname.startsWith('/customers')) return 'Customer Profile';
        if (location.pathname.startsWith('/settings')) return 'Settings';
        if (location.pathname.startsWith('/analytics')) return 'Analytics';
        return 'Dashboard';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo-area">
                    <img src="/clearlite-logo.jpg" alt="Clearlite CRM" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <span className="logo-text">Clearlite CRM</span>
                </div>

                <nav className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        <span>Customers</span>
                    </NavLink>
                    <NavLink
                        to="/analytics"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <BarChart2 size={20} />
                        <span>Analytics</span>
                    </NavLink>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="user-profile">
                    <div className="avatar">{currentUser?.name.split(' ').map(n => n[0]).join('')}</div>
                    <div className="user-info" style={{ flex: 1 }}>
                        <div className="text-sm font-bold">{currentUser?.name}</div>
                        <div className="text-xs text-muted">{currentUser?.role === 'admin' ? 'Admin' : 'User'}</div>
                    </div>
                    <button className="icon-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="header">
                    <h2 className="text-lg font-semibold">{getPageTitle()}</h2>
                    <div className="header-actions">
                        <button className="icon-btn" onClick={() => openDialer()}>
                            <Phone size={20} />
                        </button>
                        <button className="icon-btn">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
