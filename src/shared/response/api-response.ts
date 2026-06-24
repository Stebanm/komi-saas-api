import { ResponseStatus } from "./response-status";

export interface ApiResponse<T = unknown> {
    status: ResponseStatus;
    code: string;
    httpStatus: number;
    message: string;
    data: T | null;
};