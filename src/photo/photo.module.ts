import { Module } from "@nestjs/common";
import {PhotoController} from "./photo.controller";
import {PhotoService} from "./service/photo.service";
import {PhotoModuleDb} from "../../db/photo/photo.module";
import {UsersModuleDb} from "../../db/users/users.module";

@Module({
    imports: [PhotoModuleDb, UsersModuleDb],
    controllers: [PhotoController],
    providers: [PhotoService]
})
export class PhotoModule {}
