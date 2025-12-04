import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import * as bcrypt from 'bcryptjs';

export class UserService {
    private userRepository = AppDataSource.getRepository(User);

    async getAllUsers() {
        return await this.userRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    async getUserById(id: string) {
        return await this.userRepository.findOne({ where: { id } });
    }

    async createUser(userData: Partial<User>) {
        const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const user = this.userRepository.create({
            ...userData,
            mustChangePassword: true // Force password change for new users
        });

        return await this.userRepository.save(user);
    }

    async updateUser(id: string, updates: Partial<User>) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        // Don't allow updating password directly via this method
        delete updates.password;

        Object.assign(user, updates);
        return await this.userRepository.save(user);
    }

    async deleteUser(id: string) {
        const result = await this.userRepository.delete(id);
        return result.affected !== 0;
    }

    async resetPassword(id: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = true;

        return await this.userRepository.save(user);
    }

    async changePassword(id: string, oldPassword: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
            throw new Error('Invalid current password');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.mustChangePassword = false;

        return await this.userRepository.save(user);
    }
}
