import { Response } from "express";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

import { DomainException } from "@/shared/exception/domain.exception";
import { ErrorCategory } from "@/shared/exception/error-category.exception";
import { ApiResponse } from "@/shared/response/api-response";
import { CatalogEntry, RESPONSE_CATALOG, UNEXPECTED_CODE } from "@/shared/response/response-catalog";
import { ResponseCode } from "@/shared/response/response-code";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);


    private static readonly CATEGORY_TO_HTTP: Record<ErrorCategory, HttpStatus> = {
        [ErrorCategory.VALIDATION]: HttpStatus.BAD_REQUEST,
        [ErrorCategory.NOT_FOUND]: HttpStatus.NOT_FOUND,
        [ErrorCategory.CONFLICT]: HttpStatus.CONFLICT,
        [ErrorCategory.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    };


    public catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>();
        const envelope = this.toEnvelope(exception);

        response.status(envelope.httpStatus).json(envelope);
    };


    /** Busca el código en el catálogo; si no existe, cae al genérico. Nunca devuelve undefined. */
    private resolveEntry(code: string): CatalogEntry {
        return RESPONSE_CATALOG[code] ?? RESPONSE_CATALOG[UNEXPECTED_CODE]!;
    };


    private toEnvelope(exception: unknown): ApiResponse<unknown> {
        if (exception instanceof DomainException) {
            const entry = this.resolveEntry(exception.code);

            // el DETALLE técnico va SOLO al log, nunca a la respuesta
            this.logger.warn(`[${exception.code}] ${exception.detail}`);

            return {
                status: entry.status,
                code: exception.code,
                httpStatus: AllExceptionsFilter.CATEGORY_TO_HTTP[entry.category],
                message: entry.message,
                data: null
            };
        };


        if (exception instanceof HttpException) {
            const httpStatus = exception.getStatus();

            this.logger.warn(`[HTTP ${httpStatus}] ${JSON.stringify(exception.getResponse())}`);

            const entry = this.resolveEntry(ResponseCode.VALIDATION_ERROR);

            return {
                status: entry.status,
                code: ResponseCode.VALIDATION_ERROR,
                httpStatus,
                message: entry.message,
                data: null
            };
        };


        this.logger.error(exception);
        const entry = this.resolveEntry(UNEXPECTED_CODE);

        return {
            status: entry.status,
            code: UNEXPECTED_CODE,
            httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
            message: entry.message,
            data: null
        };
    };
};