import { Request, Response } from 'express';
import { UserService } from '../services/users.service';

export class UserController {
    private userService = new UserService();

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            // Remove passwords from response
            const safeUsers = users.map(user => {
                const { password, ...safeUser } = user;
                return safeUser;
            });
            return res.json(safeUsers);
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    createUser = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.createUser(req.body);
            const { password, ...safeUser } = user;
            return res.status(201).json(safeUser);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    updateUser = async (req: Request, res: Response) => {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);
            const { password, ...safeUser } = user;
            return res.json(safeUser);
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const success = await this.userService.deleteUser(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json({ message: 'User deleted successfully' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { newPassword } = req.body;
            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required' });
            }
            await this.userService.resetPassword(req.params.id, newPassword);
            return res.json({ message: 'Password reset successfully' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    changePassword = async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

            await this.userService.changePassword(req.user.id, currentPassword, newPassword);
            return res.json({ message: 'Password changed successfully' });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };
}
