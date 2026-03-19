import { Catch, HttpStatus } from '@nestjs/common';
import { DomainErrorExceptionFilter } from '../common/DomainErrorExceptionFilter';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '../common/HttpError';
import { SprintOverlapError } from '../../domain/sprint/error/SprintOverlapError';
import { InvalidSprintContextError } from '../../domain/sprint/error/InvalidSprintContextError';

@Catch()
export class SprintDomainErrorExceptionFillter extends DomainErrorExceptionFilter {
	protected errorToHttp(
		exception: any
	): HttpError<typeof BasicErrorDTOSchema> | null {
		if (exception instanceof SprintOverlapError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.CONFLICT,
				title: 'Sprint overlap detected',
				message: exception.message,
				severity: 'warning'
			});
		} else if (exception instanceof InvalidSprintContextError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Invalid sprint context',
				message: exception.message,
				severity: 'warning'
			});
		}

		return null;
	}
}
