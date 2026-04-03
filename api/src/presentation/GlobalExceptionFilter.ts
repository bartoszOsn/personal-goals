import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus
} from '@nestjs/common';
import { Response } from 'express';
import { BasicErrorDTO } from '@personal-okr/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	public catch(exception: any, host: ArgumentsHost) {
		if (exception instanceof HttpException) {
			const ctx = host.switchToHttp();

			const response: Response = ctx.getResponse();

			const data: BasicErrorDTO = {
				code: exception.getStatus(),
				title: exception.name,
				message: exception.message,
				severity: 'error'
			};

			response.status(exception.getStatus()).json(data);
			console.error(exception);
			return;
		}

		const ctx = host.switchToHttp();

		const response: Response = ctx.getResponse();

		const data: BasicErrorDTO = {
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			title: 'Internal Server Error',
			message: 'An unexpected error occurred',
			severity: 'error'
		};

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
		console.error(exception);
		return;
	}
}
