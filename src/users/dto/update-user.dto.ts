import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class UpdateUserDto {

    @Length(1, 30)
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @Length(6, 30)
    @IsString()
    password: string;
}
