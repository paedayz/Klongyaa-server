export interface IAuthService {
    signup(req: ISignupReq): Promise<IResTokens>
    signin(req: ISigninReq): Promise<IResTokens>
    logout(lineUID: string): Promise<void>
    refreshToken(req: IRefreshTokenReq): Promise<IResTokens>
    updateRtHash(lineUID: string, refreshToken: string): Promise<void>
    hashData(data: string): Promise<string>
    getTokens(lineUID: string, email: string, username: string): Promise<IResTokens>
}

export interface ISignupReq {
    email: string
    username: string
    password: string
    confirmPassword: string
    lineUID: string
}

export interface ISigninReq {
    emailOrUsername: string
    password: string
}

export interface IRefreshTokenReq {
    lineUID: string
    refreshToekn: string
}

export interface IResTokens {
    accessToken: string
    refreshToken: string
}