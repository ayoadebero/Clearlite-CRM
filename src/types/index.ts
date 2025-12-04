export type CallType = 'inbound' | 'outbound' | 'missed';
export type CustomerStatus = 'active' | 'lead' | 'inactive';

export interface Call {
    id: string;
    date: string; // ISO string
    duration: string; // e.g., "5m 23s"
    type: CallType;
}

export interface Customer {
    id: string;
    name: string;
    company: string;
    role: string;
    email: string;
    phone: string;
    status: CustomerStatus;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    avatar: string; // Initials or URL
    notes: string;
    calls: Call[];
}

// User Management Types
export type UserRole = 'admin' | 'user' | 'inputer' | 'authorizer';
export type UserStatus = 'active' | 'inactive';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // WARNING: Plain text for mock only
    role: UserRole;
    status: UserStatus;
    mustChangePassword: boolean; // Force password change on next login
    createdAt: string; // ISO string
    lastLogin?: string; // ISO string
}

export interface UserSettings {
    theme: 'dark' | 'light';
    notifications: boolean;
    language: string;
    timezone: string;
}

export interface AppSettings {
    companyName: string;
    version: string;
    autoSave: boolean;
}
