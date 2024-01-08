import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger('ProductService');
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
    ) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const { images = [], ...productDetails } = createProductDto;

            const product = this.productRepository.create({
                ...productDetails,
                images: images.map((image) =>
                    this.productImageRepository.create({ url: image }),
                ),
            });
            await this.productRepository.save(product);

            return { ...product, images: images };
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
                relations: { images: true },
            });

            return productList.map((product) => ({
                ...product,
                images: product.images.map((image) => image.url),
            }));
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOne(term: string) {
        try {
            let product: Product;

            if (isUUID(term)) {
                product = await this.productRepository.findOneBy({
                    id: term,
                });
            } else {
                const queryBuilder =
                    this.productRepository.createQueryBuilder('product');

                product = await queryBuilder
                    .where('UPPER(title) =:title or slug =:slug', {
                        title: term.toUpperCase(),
                        slug: term.toLowerCase(),
                    })
                    .leftJoinAndSelect('product.images', 'productImages')
                    .getOne();
            }

            return product;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async findOnePlain(term: string) {
        const { images = [], ...rest } = await this.findOne(term);

        return {
            ...rest,
            images: images.map((image) => image.url),
        };
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            const product = await this.productRepository.preload({
                id: id,
                ...updateProductDto,
                images: [],
            });

            if (!product)
                throw new NotFoundException(
                    `Producto con el id: ${id} no encontrado`,
                );

            await this.productRepository.save(product);

            return product;
        } catch (error) {
            this.handleDBExceptions(error);
        }
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
