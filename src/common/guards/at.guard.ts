import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { AT_STRATEGY_NAME } from "src/auth/constants/auth.constants";

@Injectable()
export class AtGuard extends AuthGuard(AT_STRATEGY_NAME) {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride('isPublic', [
            context.getHandler(),
            context.getClass(),
        ])

        if(isPublic) {
            return true;
        }

        return super.canActivate(context)
    }
}