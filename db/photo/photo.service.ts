import { Injectable } from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {Photo} from "./photo.entity";
import {EntityManager, EntityRepository} from "@mikro-orm/mysql";
import {PhotoInterface} from "./interfaces/photo.interface";

@Injectable()
export class PhotoServiceDb {
    constructor(@InjectRepository(Photo) private repository: EntityRepository<Photo>, private em: EntityManager) {};

    async savePhoto(photo: PhotoInterface) {
        await this.repository.nativeInsert({  ...photo });
    }
    async getPhotoByUserId(userId: number) {
        return await this.repository.createQueryBuilder()
            .select("*")
            .where("user_id = ?", [userId])
            .getResult();
    }
    async getPhotoByFilename(filename: string) {
        return await this.repository.findOne({ filename: filename });
    }
    async deletePhotoByFilenameAndUserId(userId: number, filename: string) {
        await this.repository.nativeDelete({ user_id: userId, filename: filename });
    }
}
