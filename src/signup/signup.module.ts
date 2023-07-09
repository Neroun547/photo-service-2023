import { Module } from "@nestjs/common";
import {SignupController} from "./signup.controller";
import {SignupService} from "./service/signup.service";
import {UsersModuleDb} from "../../db/users/users.module";

@Module({
    imports: [UsersModuleDb],
    controllers: [SignupController],
    providers: [SignupService]
})
export class SignupModule {}
