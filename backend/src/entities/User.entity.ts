import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'user' })
    role: 'admin' | 'user' | 'inputer' | 'authorizer';

    @Column({ default: 'active' })
    status: 'active' | 'inactive';

    @Column({ default: false })
    mustChangePassword: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date | null;

    // Hash password before insert/update
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith('$2a$')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    // Method to validate password
    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

    // Don't send password in responses
    toJSON() {
        const { password, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
}
