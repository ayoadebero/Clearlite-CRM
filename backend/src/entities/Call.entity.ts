import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './Customer.entity';

@Entity('calls')
export class Call {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column()
    duration: string; // e.g., "5m 23s"

    @Column()
    type: 'inbound' | 'outbound' | 'missed';

    @ManyToOne(() => Customer, customer => customer.calls, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    customerId: string;
}
