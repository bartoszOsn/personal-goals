import { ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BasicErrorDTO } from '@personal-okr/shared';

export class GlobalExceptionFilter implements ExceptionFilter {
	public catch(_exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();

		const response: Response = ctx.getResponse();

		const data: BasicErrorDTO = {
			code: HttpStatus.INTERNAL_SERVER_ERROR,
			title: 'Internal Server Error',
			message: 'An unexpected error occurred',
			severity: 'error'
		};

		response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data);
	}
}
