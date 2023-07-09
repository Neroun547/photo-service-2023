import { Module } from "@nestjs/common";
import {AuthService} from "./service/auth.service";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {UsersModuleDb} from "../../db/users/users.module";
import { JWT_SECRET, JWT_GLOBAL, JWT_EXPIRES } from "./constants/jwt.constants";

@Module({
    imports: [
        UsersModuleDb,
        JwtModule.register({
        global: JWT_GLOBAL,
        secret: JWT_SECRET,
        signOptions: { expiresIn: JWT_EXPIRES },
    })],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
