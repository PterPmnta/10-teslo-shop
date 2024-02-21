import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService,
    ) {}

    @Post('product')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: fileFilter,
            //limits: {1000}
            storage: diskStorage({
                destination: './static/products',
                filename: fileNamer,
            }),
        }),
    )
    uploadFileImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Make that the file is an image');
        }

        const secureURL = `${this.configService.get(
            'HOST_API',
        )}/files/product/${file.filename}`;

        return {
            secureURL,
        };
    }

    @Get('product/:imageName')
    findProductImage(
        @Res() res: Response,
        @Param('imageName')
        imageName: string,
    ) {
        const path = this.filesService.getStaticProductImage(imageName);
        res.sendFile(path);
    }
}
