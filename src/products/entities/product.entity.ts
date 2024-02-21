import { User } from './../../auth/entities/user.entity';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: 'd8d8d8d8-d8d8-d8d8-d8d8-d8d8d8d8d8d8',
        description: 'Product ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'T-Shirt Teslo',
        description: 'Product Title',
        uniqueItems: true,
    })
    @Column('text', { unique: true })
    title: string;

    @ApiProperty({
        example: 0,
        description: 'Product Price',
    })
    @Column('float', { default: 0 })
    price: number;

    @ApiProperty({
        example: 'Lorem ipsum',
        description: 'Product Description',
        default: null,
    })
    @Column({ type: 'text', nullable: true })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true,
    })
    @Column({ type: 'text', unique: true })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock',
        default: 0,
    })
    @Column({ type: 'int', default: 0 })
    stock: number;

    @ApiProperty({
        example: ['S', 'M', 'L'],
        description: 'Product Sizes',
    })
    @Column({ type: 'text', array: true })
    sizes: string[];

    @ApiProperty({
        example: 'Woman',
        description: 'Product Gender',
    })
    @Column({ type: 'text' })
    gender: string;

    @ApiProperty()
    @Column({ type: 'text', array: true, default: [], nullable: true })
    tags: string[];

    @ManyToOne(() => User, (user) => user.product, { eager: true })
    user: User;

    @ApiProperty()
    @OneToMany(() => ProductImage, (productImage) => productImage.product, {
        cascade: true,
        eager: true,
    })
    images?: ProductImage[];

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
