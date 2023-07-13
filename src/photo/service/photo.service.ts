import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { writeFile, unlink } from "fs/promises";
import { resolve } from "path";
import {UploadPhotoDto} from "../dto/upload-photo.dto";
import {PhotoServiceDb} from "../../../db/photo/photo.service";
import * as Moment from "moment";

@Injectable()
export class PhotoService {
    constructor(private photoServiceDb: PhotoServiceDb) {}

    async uploadPhoto(userId: number, file, body: UploadPhotoDto) {

        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype !== "image/jpg") {
            throw new BadRequestException({ message: "Image must have type .png, .jpeg, jpg" });
        }
        const randomFilename = String(Date.now()) + file.originalname;

        await writeFile(resolve("photo-service-client/public/images/" + randomFilename), file.buffer);
        await this.photoServiceDb.savePhoto({
            user_id: userId,
            date: Moment().format("YYYY-MM-DD"),
            filename: randomFilename,
            theme: body.theme
        });
    }
    async getPhotoByUserId(userId: number) {
        return await this.photoServiceDb.getPhotoByUserId(userId);
    }
    async getPhotoByFilename(filename: string) {
        const data = JSON.parse(JSON.stringify((await this.photoServiceDb.getPhotoAndUserByFilename(filename))[0]));

        if(!data) {
            throw new NotFoundException();
        }
        delete data.user.password;
        data.date = Moment(data.date).format("YYYY-MM-DD");

        return data;
    }
    async deletePhotoByFilename(userId: number, filename: string) {
        await unlink(resolve("photo-service-client/public/images/" + filename));

        await this.photoServiceDb.deletePhotoByFilenameAndUserId(userId, filename);
    }
    async changePhotoThemeByFilenameAndUserId(userId: number, filename: string, theme: string) {
        await this.photoServiceDb.changePhotoThemeByFilenameAndUserId(userId, filename, theme);
    }
    async getRandomPhoto() {
        // TODO it's just take 10 photo ...
        return await this.photoServiceDb.getPhoto(10, 0);
    }
    async getPhotoByTheme(theme: string) {
        return await this.photoServiceDb.getPhotoLikeTheme(theme);
    }
}
