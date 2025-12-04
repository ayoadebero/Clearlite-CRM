import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAdmin: () => boolean;
    updateCurrentUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                try {
                    const response = await api.get('/auth/me');
                    setCurrentUser(response.data);
                } catch (error) {
                    sessionStorage.removeItem('token');
                    setCurrentUser(null);
                }
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, token } = response.data;

            sessionStorage.setItem('token', token);
            setCurrentUser(user);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('token');
        // Optional: Call logout endpoint if you want to invalidate token on server
    };

    const isAdmin = () => {
        return currentUser?.role === 'admin';
    };

    const updateCurrentUser = (updates: Partial<User>) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, ...updates });
    };

    return (
        <AuthContext.Provider value={{
            currentUser,
            isAuthenticated: !!currentUser,
            login,
            logout,
            isAdmin,
            updateCurrentUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
