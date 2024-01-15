import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', length: 100 })
    email: string;

    @Column({ type: 'text', length: 50 })
    password: string;

    @Column({ type: 'text', length: 50 })
    fullName: string;

    @Column({ type: 'bool', default: true, unique: true })
    isActive: boolean;

    @Column({ type: 'text', array: true, default: ['user'] })
    roles: string[];
}
