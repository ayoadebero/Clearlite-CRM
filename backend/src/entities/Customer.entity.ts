import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Call } from './Call.entity';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    company: string;

    @Column()
    role: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column({ default: 'active' })
    status: 'active' | 'lead' | 'inactive';

    @Column({ default: 'approved' })
    approvalStatus: 'pending' | 'approved' | 'rejected';

    @Column({ nullable: true })
    createdBy: string; // User ID of the creator

    @Column({ default: '' })
    avatar: string; // Initials

    @Column({ type: 'text', default: '' })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Call, call => call.customer, { cascade: true, eager: true })
    calls: Call[];
}
