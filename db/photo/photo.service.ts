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
    async getPhotoByUserId(userId: number, count: number, skip: number) {
        return await this.repository.createQueryBuilder()
            .select("*")
            .where("user_id = ?", [userId])
            .limit(count)
            .offset(skip)
            .getResult();
    }
    async getPhotoByFilename(filename: string) {
        return await this.repository.findOne({ filename: filename });
    }
    async getPhotoAndUserByFilename(filename: string) {
        return await this.repository.createQueryBuilder()
            .select("*")
            .where("filename = ?", [filename])
            .leftJoinAndSelect("user", "u")
            .getResult()
    }
    async deletePhotoByFilenameAndUserIdAndReturn(userId: number, filename: string) {
        return await this.repository.nativeDelete({ user_id: userId, filename: filename });
    }
    async changePhotoThemeByFilenameAndUserId(userId: number, filename: string, theme: string) {
        await this.repository.nativeUpdate({ user_id: userId, filename: filename }, { theme: theme });
    }
    async getPhoto(count: number, skip: number) {
        return await this.repository.find({}, { limit: count, offset: skip, })
    }
    async getPhotoLikeTheme(theme: string, count: number, skip: number) {
        return await this.repository.createQueryBuilder()
            .select("*")
            .where("theme LIKE ?", ["%" + theme + "%"])
            .limit(count)
            .offset(skip)
            .getResult();
    }
}
