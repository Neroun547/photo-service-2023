import {BadRequestException, Injectable} from "@nestjs/common";
import {UsersServiceDb} from "../../../db/users/users.service";
import {SignupDto} from "../dto/signup.dto";
import * as argon from "argon2";

@Injectable()
export class SignupService {
    constructor(private usersServiceDb: UsersServiceDb) {}

    async signup(user: SignupDto) {
        const userInDb = await this.usersServiceDb.getUserByUsernameOrEmail(user.username, user.email);

        if(userInDb.length && userInDb[0].email === user.email) {
            throw new BadRequestException({ message: "User with this email already exist" });
        }
        if(userInDb.length && userInDb[0].username === user.username) {
            throw new BadRequestException({ message: "User with this username already exist" });
        }
        const hash = await argon.hash(user.password);

        await this.usersServiceDb.saveUser({ username: user.username, email: user.email, password: hash });
    }
}
