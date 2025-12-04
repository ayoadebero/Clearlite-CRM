import type { User } from '../types';

export const MOCK_USERS: User[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'admin@clearlite.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        mustChangePassword: false,
        createdAt: '2023-01-01T00:00:00Z',
        lastLogin: new Date().toISOString()
    },
    {
        id: '2',
        name: 'John Doe',
        email: 'john.doe@clearlite.com',
        password: 'user123',
        role: 'user',
        status: 'active',
        mustChangePassword: false,
        createdAt: '2023-06-15T00:00:00Z',
        lastLogin: '2023-12-01T10:30:00Z'
    },
    {
        id: '3',
        name: 'Jane Smith',
        email: 'jane.smith@clearlite.com',
        password: 'user123',
        role: 'user',
        status: 'active',
        mustChangePassword: false,
        createdAt: '2023-08-20T00:00:00Z'
    }
];

// Mock credentials (email -> password) - DEPRECATED, use userStorage.ts
export const MOCK_CREDENTIALS: Record<string, string> = {
    'admin@clearlite.com': 'admin123',
    'john.doe@clearlite.com': 'user123',
    'jane.smith@clearlite.com': 'user123'
};
