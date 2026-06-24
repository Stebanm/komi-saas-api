import { Response } from "express";
import { Reflector } from "@nestjs/core";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { map, Observable } from "rxjs";

import { ApiResponse } from "@/shared/response/api-response";
import { RESPONSE_MESSAGE_KEY } from "./response-message.decorator";
import { ResponseStatus } from "@/shared/response/response-status";
import { ResponseCode } from "@/shared/response/response-code";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(
        private readonly reflector: Reflector
    ) { };

    public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
        const httpStatus = context.switchToHttp().getResponse<Response>().statusCode;
        const message = this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ?? 'Operación exitosa.';

        return next.handle().pipe(
            map((data) => ({
                status: ResponseStatus.Success,
                code: ResponseCode.SUCCESS,
                httpStatus,
                message,
                data: (data ?? null) as T | null,
            }))
        );
    };
};