import { Module } from "@nestjs/common";
import {PhotoServiceDb} from "./photo.service";
import {MikroOrmModule} from "@mikro-orm/nestjs";
import {Photo} from "./photo.entity";

@Module({
    imports: [MikroOrmModule.forFeature([Photo])],
    providers: [PhotoServiceDb],
    exports: [PhotoServiceDb]
})
export class PhotoModuleDb {}
