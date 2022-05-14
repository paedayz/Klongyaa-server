import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResTokens, SigninReqDto, SignupReqDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    async signup(
        @Body('email') email: string,
        @Body('username') username: string,
        @Body('password') password: string,
        @Body('confirmPassword') confirmPassword: string,
        @Body('line_uid') line_uid: string,
        
    ) : Promise<ResTokens> {
        const req: SignupReqDto = {
            email,
            username,
            password,
            confirmPassword,
            line_uid
        }
        return await this.authService.signup(req)
    }

    @Post('signin')
    async signin(
        @Body('emailOrUsername') emailOrUsername: string,
        @Body('password') password: string
    ): Promise<ResTokens> {
        const req: SigninReqDto = {
            emailOrUsername,
            password
        }
        
        return await this.authService.signin(req)
    }
}
