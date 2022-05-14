import { AuthGuard } from "@nestjs/passport";
import { RT_STRATEGY_NAME } from "src/auth/constants/auth.constants";

export class RtGuard extends AuthGuard(RT_STRATEGY_NAME) {
    constructor() {
        super()
    }
}