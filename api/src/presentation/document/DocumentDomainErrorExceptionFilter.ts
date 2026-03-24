import { Catch, HttpStatus } from '@nestjs/common';
import { DomainErrorExceptionFilter } from '../common/DomainErrorExceptionFilter';
import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { HttpError } from '../common/HttpError';
import { DocumentNotFoundError } from '../../domain/document/error/DocumentNotFoundError';
import { InvalidDocumentNameError } from '../../domain/document/error/InvalidDocumentNameError';

@Catch()
export class DocumentDomainErrorExceptionFilter extends DomainErrorExceptionFilter {
	protected errorToHttp(
		exception: any
	): HttpError<typeof BasicErrorDTOSchema> | null {
		if (exception instanceof DocumentNotFoundError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.NOT_FOUND,
				title: 'Document not found',
				message: exception.message,
				severity: 'error'
			});
		} else if (exception instanceof InvalidDocumentNameError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Invalid document name',
				message: exception.message,
				severity: 'error'
			});
		}

		return null;
	}
}
