import { RichText } from './RichText';
import { TaskStatus } from './TaskStatus';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '../../time/model/SprintId';
import { KeyResultId } from './KeyResult';

export class TaskRequest {
	constructor(
		readonly name?: string,
		readonly description?: RichText,
		readonly status?: TaskStatus,
		readonly startDate?: Temporal.PlainDate | null,
		readonly endDate?: Temporal.PlainDate | null,
		readonly sprintIds?: SprintId[],
		readonly keyResult?: KeyResultId | null
	) {}
}
