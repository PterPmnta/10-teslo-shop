import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.authService.create(createUserDto);
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('private')
    @UseGuards(AuthGuard())
    testingPrivateRoute(
        @GetUser() user: User,
        @GetUser() userEmail: string,
        @GetRawHeaders() rawHeaders: string[],
    ) {
        return {
            ok: true,
            msg: 'Hola ruta privada',
            user,
            userEmail,
            rawHeaders,
        };
    }

    @Get('private2')
    @SetMetadata('roles', ['admin', 'super-user'])
    @UseGuards(AuthGuard(), UserRoleGuard)
    testingPrivateRoute_2(@GetUser() user: User) {
        return {
            ok: true,
            msg: 'Ruta privada 2',
            user,
        };
    }
}
