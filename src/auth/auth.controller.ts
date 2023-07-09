import { Body, Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import {AuthDto} from "./dto/auth.dto";
import {AuthService} from "./service/auth.service";
import {AuthGuard} from "./guards/auth.guard";

@Controller()
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async auth(@Body() body: AuthDto) {
        return { token: await this.authService.auth(body) };
    }

    @UseGuards(AuthGuard)
    @Get()
    async authUser() {
        return;
    }
}
