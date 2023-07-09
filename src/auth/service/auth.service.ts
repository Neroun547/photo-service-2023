import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {AuthDto} from "../dto/auth.dto";
import {UsersServiceDb} from "../../../db/users/users.service";
import * as argon from "argon2";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersServiceDb: UsersServiceDb,
        private jwtService: JwtService
    ) {}

    async auth(user: AuthDto): Promise<string> {
        const userInDb = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserByUsernameOrEmail(user.username, user.username)));

        if(!userInDb.length) {
            throw new NotFoundException({ message: "User with this email or username not found" });
        }
        const verifyPassword = await argon.verify(userInDb[0].password, user.password);

        if(!verifyPassword) {
            throw new ForbiddenException({ message: "Wrong password" });
        }
        delete userInDb[0].password;

        return await this.jwtService.signAsync(userInDb[0]);
    }
}
