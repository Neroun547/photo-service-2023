import { Module } from "@nestjs/common";
import {UsersController} from "./users.controller";
import {UsersService} from "./service/users.service";
import {UsersModuleDb} from "../../db/users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {JWT_EXPIRES, JWT_GLOBAL, JWT_SECRET} from "../auth/constants/jwt.constants";

@Module({
    imports: [
        UsersModuleDb,
        JwtModule.register({
            global: JWT_GLOBAL,
            secret: JWT_SECRET,
            signOptions: {expiresIn: JWT_EXPIRES}
        })
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
