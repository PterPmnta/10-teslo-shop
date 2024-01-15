import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text', select: false })
    password: string;

    @Column({ type: 'text' })
    fullName: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @Column({ type: 'text', array: true, default: ['user'] })
    roles: string[];

    @BeforeInsert()
    convertEmailLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
