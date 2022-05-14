import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUserLineUID = createParamDecorator(
    (data: undefined, context: ExecutionContext): string => {
        const request = context.switchToHttp().getRequest();
        return request.user['sub']
    }
)