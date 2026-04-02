import { BasicErrorDTOSchema } from '@personal-okr/shared';
import { DomainErrorExceptionFilter } from '../common/DomainErrorExceptionFilter';
import { Catch, HttpStatus } from '@nestjs/common';
import { HttpError } from '../common/HttpError';
import { InvalidWorkItemHierarchyException } from '../../domain/work-item-v2/error/InvalidWorkItemHierarchyException';
import { InvalidWorkItemNameError } from '../../domain/work-item-v2/error/InvalidWorkItemNameError';
import { TimeFrameOutOfContextException } from '../../domain/work-item-v2/error/TimeFrameOutOfContextException';
import { WorkItemNotFoundError } from '../../domain/work-item-v2/error/WorkItemNotFoundError';

@Catch()
export class WorkItemDomainErrorExceptionFilter extends DomainErrorExceptionFilter {
	protected override errorToHttp(
		exception: any
	): HttpError<typeof BasicErrorDTOSchema> | null {
		if (exception instanceof InvalidWorkItemHierarchyException) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Invalid work item hierarchy',
				message: exception.message,
				severity: 'error'
			});
		} else if (exception instanceof InvalidWorkItemNameError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Invalid work item name',
				message: exception.message,
				severity: 'error'
			});
		} else if (exception instanceof TimeFrameOutOfContextException) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Time frame out of context',
				message: exception.message,
				severity: 'error'
			});
		} else if (exception instanceof WorkItemNotFoundError) {
			return new HttpError(BasicErrorDTOSchema, {
				code: HttpStatus.BAD_REQUEST,
				title: 'Work item not found',
				message: exception.message,
				severity: 'error'
			});
		}

		return null;
	}
}
