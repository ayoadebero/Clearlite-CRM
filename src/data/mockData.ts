import type { Customer } from '../types';

export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: '1',
        name: 'Sarah Wilson',
        company: 'TechFlow Inc.',
        role: 'CTO',
        email: 'sarah.w@techflow.com',
        phone: '+1 (555) 123-4567',
        status: 'active',
        approvalStatus: 'approved',
        avatar: 'SW',
        notes: 'Interested in the enterprise plan. Follow up next week.',
        calls: [
            { id: 'c1', date: '2023-10-25T14:30:00', duration: '5m 23s', type: 'outbound' },
            { id: 'c2', date: '2023-10-20T10:15:00', duration: '2m 10s', type: 'inbound' }
        ]
    },
    {
        id: '2',
        name: 'Michael Chen',
        company: 'StartUp Rocket',
        role: 'Founder',
        email: 'm.chen@rocket.io',
        phone: '+1 (555) 987-6543',
        status: 'lead',
        approvalStatus: 'approved',
        avatar: 'MC',
        notes: 'Met at the conference. Needs a demo.',
        calls: []
    },
    {
        id: '3',
        name: 'Emma Davis',
        company: 'Global Solutions',
        role: 'Procurement',
        email: 'emma.d@globalsolutions.com',
        phone: '+1 (555) 456-7890',
        status: 'inactive',
        approvalStatus: 'approved',
        avatar: 'ED',
        notes: 'Contract expired last month.',
        calls: [
            { id: 'c3', date: '2023-09-15T09:00:00', duration: '15m 45s', type: 'outbound' }
        ]
    }
];
