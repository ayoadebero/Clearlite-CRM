import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService = new AuthService();

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await this.authService.login(email, password);
            return res.json(result);
        } catch (error: any) {
            return res.status(401).json({ message: error.message || 'Authentication failed' });
        }
    };

    me = async (req: Request, res: Response) => {
        // User is already attached by auth middleware
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const { password, ...userWithoutPassword } = req.user;
        return res.json(userWithoutPassword);
    };
}
