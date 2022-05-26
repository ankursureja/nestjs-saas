import {
	Injectable,
	NestInterceptor,
	Catch,
	ExceptionFilter,
	ArgumentsHost,
	HttpStatus,
	ExecutionContext,
	HttpException,
	CallHandler
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { isEmpty } from "lodash";
import { QueryFailedError } from "typeorm";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((err) => {
				// Class-validator error transform
				let errMessageArray: string | null = null;
				let errData: unknown | null = null;
				if (
					!isEmpty(err) &&
					!isEmpty(err.response) &&
					!isEmpty(err.response.message)
				) {
					if (Array.isArray(err.response.message)) {
						errMessageArray = err.response.message.join(", ");
					}
				}

				if (
					!isEmpty(err) &&
					!isEmpty(err.response) &&
					!isEmpty(err.response.response) &&
					!isEmpty(err.response.response.errorData)
				) {
					errData = err.response.response.errorData;
				}

				return throwError(
					new HttpException(
						{
							data: isEmpty(errData) ? {} : errData,
							message: errMessageArray || err.response.message || err.message
						},
						err.status || HttpStatus.INTERNAL_SERVER_ERROR
					)
				);
			})
		);
	}
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		const status =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;
		let errResData: any = null;

		//console.log(exception);
		if (!isEmpty(exception) && !isEmpty(exception.getResponse())) {
			const errorResp: any = exception.getResponse();

			if (!isEmpty(errorResp.data)) {
				errResData = errorResp.data;
			}
		}

		response.status(status).json({
			data: errResData ? errResData : {},
			message: exception.message || "INTERNAL_SERVER_ERROR",
			status: false
		});
	}
}
