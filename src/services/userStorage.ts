import type { User, UserSettings, AppSettings } from '../types';
import api from './api';

const SETTINGS_KEY = 'clearlite_crm_settings';
const APP_SETTINGS_KEY = 'clearlite_crm_app_settings';

// Initialize not needed for API
export const initializeStorage = () => { };

// User CRUD operations
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    // Not used directly in new flow, but kept for compatibility
    const users = await getUsers();
    return users.find(u => u.email === email);
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    // This will now make an API call via getUsers()
    const users = await getUsers();
    return users.find(u => u.id === id);
};

export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, updates);
    return response.data;
};

export const deleteUser = async (id: string): Promise<boolean> => {
    await api.delete(`/users/${id}`);
    return true;
};

// Password operations
export const resetUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
    await api.post(`/users/${userId}/reset-password`, { newPassword });
    return true;
};

export const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    await api.post('/users/change-password', { currentPassword: oldPassword, newPassword });
    return true;
};

// User Settings operations
export const getUserSettings = (userId: string): UserSettings => {
    const data = localStorage.getItem(`${SETTINGS_KEY}_${userId}`);
    if (data) return JSON.parse(data);

    // Default settings
    return {
        theme: 'dark',
        notifications: true,
        language: 'en',
        timezone: 'America/New_York'
    };
};

export const saveUserSettings = (userId: string, settings: UserSettings): void => {
    localStorage.setItem(`${SETTINGS_KEY}_${userId}`, JSON.stringify(settings));
};

// App Settings operations
export const getAppSettings = (): AppSettings => {
    const data = localStorage.getItem(APP_SETTINGS_KEY);
    return data ? JSON.parse(data) : {
        companyName: 'Clearlite Solution LLC',
        version: '1.0.0',
        autoSave: true
    };
};

export const saveAppSettings = (settings: AppSettings): void => {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
    localStorage.clear();
    sessionStorage.clear();
};
