import { PaginationDto } from 'src/common/dtos/pagination.dto';
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
import { validate as isUUID } from 'uuid';

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

    async findAll(paginationDto: PaginationDto) {
        try {
            const limit = paginationDto.limit;
            const offset = paginationDto.offset - 1;

            const productList = await this.productRepository.find({
                take: limit,
                skip: offset,
            });
            return productList;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(term: string) {
        try {
            let product: Product;

            if (isUUID(term)) {
                product = await this.productRepository.findOne({
                    where: { id: term },
                });
            } else {
                const queryBuilder =
                    this.productRepository.createQueryBuilder();

                product = await queryBuilder
                    .where('UPPER(title) =:title or slug =:slug', {
                        title: term.toUpperCase(),
                        slug: term.toLowerCase(),
                    })
                    .getOne();
            }

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
