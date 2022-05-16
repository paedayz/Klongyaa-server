import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthService, IRefreshTokenReq, IResTokens, ISigninReq, ISignupReq } from './interfaces/auth.service.interfaces';
import * as bcrypt from 'bcrypt'
import { AT_EXPIREIN, RT_EXPIREIN } from './constants/auth.constants';
import { ISaveUserEntity, UserEntity } from './models';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly jwtService: JwtService,
    ){}

    async signup(req: ISignupReq): Promise<IResTokens> {
        if(req.password !== req.confirmPassword) throw new BadRequestException('Password not match')

        try {
            const hashPassword = await this.hashData(req.password)
            const saveUser: ISaveUserEntity = {
                email: req.email,
                hashPassword,
                username: req.username,
                lineUID: req.lineUID
            }
            
            await this.userRepository.save(saveUser)

            const tokens = await this.getTokens(req.lineUID, req.email, req.username)

            await this.updateRtHash(req.lineUID, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new BadRequestException(error.detail)
        }
        
    }
    async signin(req: ISigninReq): Promise<IResTokens> {
        try {
            const user = await this.userRepository.findOne({
                where: [
                    {email: req.emailOrUsername},
                    {username: req.emailOrUsername}
                ]
            })
            
            if(!user) throw new BadRequestException('User not found')

            const passwordmatches = await bcrypt.compare(req.password, user.hashPassword)
            if(!passwordmatches) throw new BadRequestException('Password not matches')

            const tokens = await this.getTokens(user.lineUID, user.email, user.username)
            await this.updateRtHash(user.lineUID, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
    async logout(lineUID: string): Promise<void> {
        try {
            await this.userRepository.update({
                lineUID
            }, {
                hashRt: null
            })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
    async refreshToken(req: IRefreshTokenReq): Promise<IResTokens> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    lineUID: req.lineUID
                }
            })
            if(!user || !user.hashRt || !req.refreshToekn) throw new BadRequestException('Access Denied')

            const rtMatches = await bcrypt.compare(req.refreshToekn, user.hashRt)
            if(!rtMatches) throw new BadRequestException('Access Denied')

            const tokens = await this.getTokens(user.lineUID, user.email, user.username)
            await this.updateRtHash(user.lineUID, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async updateRtHash(lineUID: string, refreshToken: string) {
        const hashRt = await this.hashData(refreshToken)
        await this.userRepository.update({
            lineUID
        }, {
            hashRt
        })
    }
    async hashData(data: string): Promise<string> {
        return await bcrypt.hash(data, 10)
    }
    async getTokens(lineUID: string, email: string, username: string): Promise<IResTokens> {
        const [at, rt] = await Promise.all([
            // access token
            this.jwtService.signAsync({
                sub: lineUID,
                email,
                username
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: AT_EXPIREIN,
            }),

            // refresh token
            this.jwtService.signAsync({
                sub: lineUID,
                email,
                username
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: RT_EXPIREIN,
            }),
        ])

        return {
            accessToken: at,
            refreshToken: rt
        }
    }

    

}
