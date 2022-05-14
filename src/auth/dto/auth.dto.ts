import { IsEmail, IsString } from "class-validator";

export class SignupReqDto {
    @IsEmail()
    email: string;

    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

    @IsString()
    line_uid: string;
}

export class SigninReqDto {
    @IsString()
    emailOrUsername: string;

    @IsString()
    password: string;
}

export class RefreshTokenReqDto {
    @IsString()
    line_uid: string;

    @IsString()
    refreshToekn: string;
}

export class ResTokens {
    @IsString()
    accessToken: string;

    @IsString()
    refreshToken: string;
}