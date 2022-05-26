export interface ResponseGlobalInterface<T> {
    data: T;
    message: string;
}

export type SuccessResponse = Record<string, unknown> | Array<unknown>;

export type GlobalResponseType = Promise<ResponseGlobalInterface<SuccessResponse>>;