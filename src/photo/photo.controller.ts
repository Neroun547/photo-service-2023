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
    Delete, Patch, Query, ParseIntPipe
} from "@nestjs/common";
import {PhotoService} from "./service/photo.service";
import {AuthGuard} from "../auth/guards/auth.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {UploadPhotoDto} from "./dto/upload-photo.dto";
import { Request, Response } from "express";
import { readFile } from "fs/promises";
import { resolve } from "path";
import {ChangePhotoThemeDto} from "./dto/change-photo-theme.dto";

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
    async getUserPhoto(
        @Req() req: Request,
        @Query("count", new ParseIntPipe()) count: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.photoService.getPhotoByUserId(req["user"].id, count, skip);
    }

    @Get("random-photo")
    async getRandomPhoto(
        @Query("count", new ParseIntPipe()) count: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.photoService.getRandomPhoto(count, skip);
    }

    @Get("by-username/:username")
    async getPhotoByUsername(
        @Param("username") username: string,
        @Query("count", new ParseIntPipe()) count: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.photoService.getPhotoByUsername(username, count, skip);
    }

    @Get("by-theme/:theme")
    async getPhotoByTheme(
        @Param("theme") theme: string,
        @Query("count", new ParseIntPipe()) count: number,
        @Query("skip", new ParseIntPipe()) skip: number
    ) {
        return await this.photoService.getPhotoByTheme(theme, count, skip);
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

    @UseGuards(AuthGuard)
    @Patch(":filename")
    async changePhotoThemeByFilenameAndUserId(@Req() req: Request, @Body() body: ChangePhotoThemeDto, @Param("filename") filename: string) {
        await this.photoService.changePhotoThemeByFilenameAndUserId(req["user"].id, filename, body.theme);

        return;
    }
}
