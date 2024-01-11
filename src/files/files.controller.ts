import {
    BadRequestException,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

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
        return {
            fileName: file.originalname,
        };
    }
}
