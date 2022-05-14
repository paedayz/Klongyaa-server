import { RefreshTokenReqDto, ResTokens, SigninReqDto, SignupReqDto } from "../dto/auth.dto";

export interface IAuthService {
    signup(req: SignupReqDto): Promise<ResTokens>;
    signin(req: SigninReqDto): Promise<ResTokens>;
    logout(line_uid: string): Promise<void>;
    refreshToken(req: RefreshTokenReqDto): Promise<ResTokens>;
    updateRtHash(line_uid: string, refreshToken: string): Promise<void>;
    hashData(data: string): Promise<string>
    getTokens(line_uid: string, email: string, username: string): Promise<ResTokens>;
}