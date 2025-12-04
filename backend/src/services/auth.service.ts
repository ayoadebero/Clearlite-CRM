import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.status !== 'active') {
            throw new Error('Account is inactive');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date();
        await this.userRepository.save(user);

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    }
}
