import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserData, GetCurrentUserLineUID, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { STR_REFRESHTOKEN } from './constants/auth.constants';
import { ResTokens, SigninBodyDto, SignupBodyDto } from './dto/auth.dto';
import { IResTokens, ISignupReq, ISigninReq, IRefreshTokenReq } from './interfaces/auth.service.interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @Post('signup')
    async signup(
        @Body() body: SignupBodyDto
        
    ) : Promise<ResTokens> {
        const req: ISignupReq = {
            email: body.email,
            username: body.username,
            password: body.password,
            confirmPassword: body.confirmPassword,
            lineUID: body.lineUID,
        }

        const tokens = await this.authService.signup(req)
        return new ResTokens(tokens)
    }

    @Public()
    @Post('signin')
    async signin(
        @Body() body: SigninBodyDto
    ): Promise<ResTokens> {
        const req: ISigninReq = {
            emailOrUsername: body.emailOrUsername,
            password: body.password
        }
        
        const tokens = await this.authService.signin(req)
        return new ResTokens(tokens)
    }

    @Post('logout')
    async logout(@GetCurrentUserLineUID() lineUID: string): Promise<void> {
        return await this.authService.logout(lineUID)
    }

    @Public()
    @Post('refreshToken')
    @UseGuards(RtGuard)
    async refreshToken(
        @GetCurrentUserLineUID() lineUID: string,
        @GetCurrentUserData(STR_REFRESHTOKEN) rt: string,
    ) {
        const req: IRefreshTokenReq = {
            lineUID,
            refreshToekn: rt
        }

        const tokens = await this.authService.refreshToken(req)
        return new ResTokens(tokens)
    }
}
