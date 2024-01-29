import { ValidRoles } from './../auth/enums/valid-roles.enum';
import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
    constructor(private readonly seedService: SeedService) {}

    @Get()
    //@Auth(ValidRoles.admin)
    executeSeed() {
        return this.seedService.runSeed();
    }
}
