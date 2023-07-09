import { Module } from "@nestjs/common";
import {PhotoController} from "./photo.controller";
import {PhotoService} from "./service/photo.service";
import {PhotoModuleDb} from "../../db/photo/photo.module";

@Module({
    imports: [PhotoModuleDb],
    controllers: [PhotoController],
    providers: [PhotoService]
})
export class PhotoModule {}
