import {Body, Controller, Get, Patch, Req, UploadedFile, UseGuards, UseInterceptors} from "@nestjs/common";
import {UsersService} from "./service/users.service";
import {Request} from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller()
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getUserData(@Req() req: Request) {
        return req["user"];
    }

    @UseGuards(AuthGuard)
    @Patch()
    @UseInterceptors(FileInterceptor("avatar"))
    async updateUserData(@Req() req: Request, @UploadedFile() file, @Body() body: UpdateUserDto) {
        if(file) {
            return {token: await this.usersService.updateUser({id: req["user"].id, ...body}, file)};
        } else {
            return {token: await this.usersService.updateUser({id: req["user"].id, ...body}, null)};
        }
    }
}
