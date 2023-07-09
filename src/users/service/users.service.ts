import {BadRequestException, Injectable} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {UsersInterface} from "../../../db/users/interfaces/users.interface";
import {JwtService} from "@nestjs/jwt";
import * as argon from "argon2";

@Injectable()
export class UsersService {
    constructor(private usersServiceDb: UsersServiceDb, private jwtService: JwtService) {}

    async updateUser(user: UsersInterface): Promise<string> {
        const userWithTheSameEmailOrUsername = await this.usersServiceDb.getUserByUsernameOrEmail(user.username, user.email);

        if(userWithTheSameEmailOrUsername.length
            && userWithTheSameEmailOrUsername[0].username === user.username
            && userWithTheSameEmailOrUsername[0].id !== user.id
        ) {
            throw new BadRequestException({ message: "User with the same username already exist" });
        }
        if(userWithTheSameEmailOrUsername.length
            && userWithTheSameEmailOrUsername[0].email === user.email
            && userWithTheSameEmailOrUsername[0].id !== user.id
        ) {
            throw new BadRequestException({ message: "User with the same email already exist" });
        }
        if(user.password) {
            user.password = user.password.trim().replaceAll(" ", "");
        }
        if(typeof user.password === "string" && user.password.length < 6) {
            throw new BadRequestException({ message: "Password must have more then 5 characters" });
        }
        user.password = await argon.hash(user.password);

        await this.usersServiceDb.updateUserById(user.id, user);

        delete user.password

        return await this.jwtService.signAsync(user);
    }
}
