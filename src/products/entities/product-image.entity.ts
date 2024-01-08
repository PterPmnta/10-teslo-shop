import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product-image')
export class ProductImage {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('text', { array: true }) url: string[];

    @ManyToOne(() => Product, (product) => product.images, {
        onDelete: 'CASCADE',
    })
    product: Product;
}
