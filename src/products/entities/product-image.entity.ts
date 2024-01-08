import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product-image')
export class ProductImage {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('text', { array: true }) url: string[];
}
