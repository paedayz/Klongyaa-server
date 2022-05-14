import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserData, GetCurrentUserLineUID, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { STR_REFRESHTOKEN } from './constants/auth.constants';
import { RefreshTokenReqDto, ResTokens, SigninReqDto, SignupReqDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
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

    @Public()
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

    @Post('logout')
    async logout(@GetCurrentUserLineUID() line_uid: string): Promise<void> {
        return await this.authService.logout(line_uid)
    }

    @Public()
    @Post('refreshToken')
    @UseGuards(RtGuard)
    async refreshToken(
        @GetCurrentUserLineUID() line_uid: string,
        @GetCurrentUserData(STR_REFRESHTOKEN) rt: string,
    ) {
        const req: RefreshTokenReqDto = {
            line_uid,
            refreshToekn: rt
        }
        return await this.authService.refreshToken(req)
    }
}
