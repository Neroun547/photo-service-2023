import {BadRequestException, Injectable} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {JwtService} from "@nestjs/jwt";
import * as argon from "argon2";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import {UpdateUserInterface} from "../interfaces/update-user.interface";

@Injectable()
export class UsersService {
    constructor(private usersServiceDb: UsersServiceDb, private jwtService: JwtService) {}

    async updateUser(user: UpdateUserInterface, file?): Promise<string> {
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

            if(typeof user.password === "string" && user.password.length < 6) {
                throw new BadRequestException({ message: "Password must have more then 5 characters" });
            }
            user.password = await argon.hash(user.password);
        }
        if(file) {
            const avatarName = Date.now() + file.originalname;
            await writeFile(resolve("photo-service-client/public/avatars/" + avatarName), file.buffer);

            await this.usersServiceDb.updateUserById(user.id, {...user, avatar: avatarName});

            const userById = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserById(user.id)));

            return await this.jwtService.signAsync({ id: userById.id, username: userById.username, email: userById.email, avatar: avatarName  });
        }
        await this.usersServiceDb.updateUserById(user.id, { ...user });

        const userById = JSON.parse(JSON.stringify(await this.usersServiceDb.getUserById(user.id)));

        return await this.jwtService.signAsync({ id: userById.id, username: userById.username, email: userById.email, avatar: userById.avatar });
    }
}
