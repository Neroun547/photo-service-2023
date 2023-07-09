import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Req,
    Res,
    Get,
    Param,
    Delete
} from "@nestjs/common";
import {PhotoService} from "./service/photo.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadPhotoDto} from "./dto/upload-photo.dto";
import { Request, Response } from "express";
import { readFile } from "fs/promises";
import { resolve } from "path";

@Controller()
export class PhotoController {
    constructor(private photoService: PhotoService) {}

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    async uploadPhoto(@Req() req: Request, @UploadedFile() file, @Body() body: UploadPhotoDto) {
        await this.photoService.uploadPhoto(req["user"].id, file, body);

        return;
    }

    @Get("download/:filename")
    async downloadPhoto(@Param("filename") filename: string, @Res() res: Response) {
        res.sendFile(resolve("photo-service-client/public/images/" + filename));
    }

    @UseGuards(AuthGuard)
    @Get("user-photo")
    async getUserPhoto(@Req() req: Request) {
        return await this.photoService.getPhotoByUserId(req["user"].id);
    }

    @Get(":filename")
    async getPhotoByFilename(@Param("filename") filename: string) {
        return await this.photoService.getPhotoByFilename(filename);
    }

    @UseGuards(AuthGuard)
    @Delete(":filename")
    async deletePhoto(@Req() req: Request, @Param("filename") filename: string) {
        await this.photoService.deletePhotoByFilename(req["user"].id, filename);

        return;
    }

}
