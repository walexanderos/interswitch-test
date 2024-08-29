import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsNumberString } from 'class-validator';

export class EmailDto {
    @IsEmail()  email: string;
}

export class TokenDto {
    @IsNotEmpty() token: string;
}

export class LoginDto {
    @IsEmail()    email: string;
    @IsNotEmpty() password: string;
    @IsNotEmpty() type: string
}