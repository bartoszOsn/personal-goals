import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { HttpError } from './HttpError';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { Response } from 'express';

export abstract class DomainErrorExceptionFilter implements ExceptionFilter {
	public catch(exception: any, host: ArgumentsHost): void {
		const httpError = this.errorToHttp(exception);
		if (!httpError) {
			throw exception;
		}

		const response: Response = host.switchToHttp().getResponse();
		response.status(httpError.data.code).json(httpError.data);
		console.error(exception);
	}

	protected abstract errorToHttp(
		exception: any
	): HttpError<typeof BasicErrorDTOSchema> | null;
}
