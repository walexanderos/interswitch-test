import { IsInt, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty() username: string;
    @IsNotEmpty() password: string;
}

export class RegisterDto {
    @IsNotEmpty() @IsInt() role_id: number;
    @IsNotEmpty() username: string;
    @IsNotEmpty() password: string;
}