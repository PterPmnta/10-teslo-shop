import {
    IsEmail,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'El correo electronico debe ser valido' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'The password must have a Uppercase, lowercase letter and a number',
    })
    password: string;

    @IsString()
    @MinLength(1)
    @MinLength(1)
    @MaxLength(50)
    fullName: string;
}
