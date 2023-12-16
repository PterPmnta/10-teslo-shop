import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn('uuid') id: number;

    @Column('text', { unique: true }) title: string;
}
