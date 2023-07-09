import {IsEmail, IsString, Length} from "class-validator";

export class SignupDto {

    @Length(1, 30)
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @Length(6, 30)
    @IsString()
    password: string;
}
