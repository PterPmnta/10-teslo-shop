import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger('ProductService');
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const product = this.productRepository.create(createProductDto);
            await this.productRepository.save(product);

            return product;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findAll() {
        try {
            const productList = await this.productRepository.find();
            return productList;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(id: string) {
        try {
            const product = await this.productRepository.findOne({
                where: { id: id },
            });
            return product;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    update(id: number, updateProductDto: UpdateProductDto) {
        return `This action updates a #${id} product`;
    }

    async remove(id: string) {
        try {
            await this.productRepository.delete(id);
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    private handleDBExceptions(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException(
            'Unexpected error, check server logs.',
        );
    }
}
