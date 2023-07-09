import {Body, Controller, Post} from "@nestjs/common";
import {SignupService} from "./service/signup.service";
import {SignupDto} from "./dto/signup.dto";

@Controller()
export class SignupController {
    constructor(private signupService: SignupService) {}

    @Post()
    async signup(@Body() body: SignupDto) {
        await this.signupService.signup(body);

        return { message: "User created" };
    }
}
