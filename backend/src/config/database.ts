import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../entities/User.entity';
import { Customer } from '../entities/Customer.entity';
import { Call } from '../entities/Call.entity';

dotenv.config();

// Railway provides DATABASE_URL, parse it if available
const databaseUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
    databaseUrl
        ? {
            type: 'postgres',
            url: databaseUrl,
            synchronize: process.env.NODE_ENV === 'development',
            logging: process.env.NODE_ENV === 'development',
            entities: [User, Customer, Call],
            migrations: [],
            subscribers: [],
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_DATABASE || 'clearlite_crm',
            synchronize: process.env.NODE_ENV === 'development', // Auto-create tables in dev
            logging: process.env.NODE_ENV === 'development',
            entities: [User, Customer, Call],
            migrations: [],
            subscribers: [],
        }
);

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✓ Database connection established');
    } catch (error) {
        console.error('✗ Database connection failed:', error);
        throw error;
    }
};
