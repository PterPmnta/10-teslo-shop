import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const { password, ...userData } = createUserDto;

            const user = this.userRepository.create({
                ...userData,
                password: bcrypt.hashSync(password, 10),
            });
            await this.userRepository.save(user);

            delete user.password;

            return user;
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    async login(loginUserDto: LoginUserDto) {
        try {
            const { password, email } = loginUserDto;

            const user = await this.userRepository.findOne({
                where: { email },
                select: { email: true, password: true },
            });

            if (!user)
                throw new BadRequestException('Credentials are not valid');

            if (!bcrypt.compareSync(password, user.password))
                throw new BadRequestException('Credentials are not valid');

            delete user.password;
            return { ...user, token: this.getJwtToken({ email: user.email }) };
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    private getJwtToken(payload: IJwtPayload) {
        const token = this.jwtService.sign(payload);
        return token;
    }

    private handleDBExceptions(error: any): never {
        if (error.code === '23505') throw new BadRequestException(error.detail);

        this.logger.error(error);
        throw new InternalServerErrorException(
            'Unexpected error, check server logs.',
        );
    }
}
