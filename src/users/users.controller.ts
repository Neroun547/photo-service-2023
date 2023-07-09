import {Body, Controller, Get, Patch, Req, UseGuards} from "@nestjs/common";
import {UsersService} from "./service/users.service";
import {Request} from "express";
import {AuthGuard} from "../auth/guards/auth.guard";
import {UpdateUserDto} from "./dto/update-user.dto";

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
    async updateUserData(@Req() req: Request, @Body() body: UpdateUserDto) {
        return { token: await this.usersService.updateUser({ id: req["user"].id, ...body })};
    }
}
