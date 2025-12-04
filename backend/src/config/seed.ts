import 'reflect-metadata';
import { AppDataSource } from './database';
import { User } from '../entities/User.entity';
import { Customer } from '../entities/Customer.entity';
import { Call } from '../entities/Call.entity';

async function seed() {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();
        console.log('✓ Database connected');

        const userRepo = AppDataSource.getRepository(User);
        const customerRepo = AppDataSource.getRepository(Customer);

        // Check if old or new admin exists
        const existingAdmin = await userRepo.findOne({
            where: [
                { email: 'admin@clearlite.com' },
                { email: 'admin@clearlitesolutionllc.com' }
            ]
        });

        if (existingAdmin) {
            console.log('⚠ Found existing data. Clearing database for reset...');
            // clear() truncates the table, which is cleaner for a reset
            // We need to clear calls first if cascading isn't set up, but TypeORM clear() usually handles it or we do it in order
            // Actually, clear() might fail if foreign keys exist and cascade isn't perfect.
            // Let's try deleting customers (which have calls) and users.
            // But delete({}) failed. Let's use delete(() => "") or just query.
            // Safest for seeding:
            await AppDataSource.query('TRUNCATE TABLE "calls" CASCADE');
            await AppDataSource.query('TRUNCATE TABLE "customers" CASCADE');
            await AppDataSource.query('TRUNCATE TABLE "users" CASCADE');
        }

        console.log('Seeding database...');

        // Create users
        const users = userRepo.create([
            {
                name: 'Admin User',
                email: 'admin@clearlitesolutionllc.com',
                password: 'Admin@2024', // Will be hashed by entity hook
                role: 'admin',
                status: 'active',
                mustChangePassword: false,
                lastLogin: new Date()
            },
            {
                name: 'John Doe',
                email: 'john.doe@clearlitesolutionllc.com',
                password: 'User@2024',
                role: 'user',
                status: 'active',
                mustChangePassword: false,
                lastLogin: new Date()
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@clearlitesolutionllc.com',
                password: 'User@2024',
                role: 'user',
                status: 'active',
                mustChangePassword: false
            },
            {
                name: 'Inputer User',
                email: 'inputer@clearlitesolutionllc.com',
                password: 'Inputer@2024',
                role: 'inputer',
                status: 'active',
                mustChangePassword: false
            },
            {
                name: 'Authorizer User',
                email: 'authorizer@clearlitesolutionllc.com',
                password: 'Authorizer@2024',
                role: 'authorizer',
                status: 'active',
                mustChangePassword: false
            },
            {
                name: 'Michael Adebero',
                email: 'michael.adebero@clearlitesolutionllc.com',
                password: 'Inputer@2024',
                role: 'inputer',
                status: 'active',
                mustChangePassword: false
            }
        ]);

        await userRepo.save(users);
        console.log('✓ Users created');

        // Create customers with calls
        const customers = customerRepo.create([
            {
                name: 'Sarah Johnson',
                company: 'TechCorp Inc.',
                role: 'CEO',
                email: 'sarah@techcorp.com',
                phone: '+1 555-1234',
                status: 'active',
                avatar: 'SJ',
                notes: 'Key decision maker. Interested in enterprise solutions.',
                calls: [
                    { date: new Date('2023-12-01T10:30:00'), duration: '15m 23s', type: 'outbound' },
                    { date: new Date('2023-11-28T14:15:00'), duration: '8m 45s', type: 'inbound' }
                ]
            },
            {
                name: 'Michael Chen',
                company: 'StartupXYZ',
                role: 'CTO',
                email: 'michael@startupxyz.com',
                phone: '+1 555-5678',
                status: 'lead',
                avatar: 'MC',
                notes: 'Exploring options. Schedule follow-up next week.',
                calls: [
                    { date: new Date('2023-12-02T09:00:00'), duration: '22m 10s', type: 'outbound' }
                ]
            },
            {
                name: 'Emily Rodriguez',
                company: 'Global Solutions LLC',
                role: 'Marketing Director',
                email: 'emily@globalsolutions.com',
                phone: '+1 555-9012',
                status: 'active',
                avatar: 'ER',
                notes: 'Long-term client. Quarterly review scheduled.',
                calls: [
                    { date: new Date('2023-11-30T16:00:00'), duration: '12m 30s', type: 'inbound' },
                    { date: new Date('2023-11-25T11:20:00'), duration: '18m 55s', type: 'outbound' },
                    { date: new Date('2023-11-20T13:40:00'), duration: '5m 12s', type: 'missed' }
                ]
            },
            {
                name: 'David Kim',
                company: 'Enterprise Co.',
                role: 'VP of Operations',
                email: 'david@enterprise.co',
                phone: '+1 555-3456',
                status: 'inactive',
                avatar: 'DK',
                notes: 'Account on hold. Reach out in Q2.',
                calls: []
            }
        ]);

        await customerRepo.save(customers);
        console.log('✓ Customers and calls created');

        console.log('\n✓ Database seeded successfully!');
        console.log('\nLogin credentials:');
        console.log('  Admin: admin@clearlitesolutionllc.com / Admin@2024');
        console.log('  User: john.doe@clearlitesolutionllc.com / User@2024');
        console.log('  Inputer: inputer@clearlitesolutionllc.com / Inputer@2024');
        console.log('  Authorizer: authorizer@clearlitesolutionllc.com / Authorizer@2024');

        await AppDataSource.destroy();
    } catch (error) {
        console.error('✗ Seeding failed:', error);
        process.exit(1);
    }
}

seed();
