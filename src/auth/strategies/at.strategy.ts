import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { AT_STRATEGY_NAME } from "../constants/auth.constants";

type JwtPayload = {
    sub: string,
    email: string,
    username: string,
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, AT_STRATEGY_NAME) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AT_SECRET
        })
    }

    validate(payload: JwtPayload) {
        return payload
    }
}