import { TaskRequest } from './TaskRequest';
import { RichText } from './RichText';
import { TaskStatus } from './TaskStatus';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '../../time/model/SprintId';
import { KeyResultId } from './KeyResult';

export class CompleteTaskRequest extends TaskRequest {
	private static taskRequestDefaults = new CompleteTaskRequest(
		'New task',
		new RichText(''),
		TaskStatus.TODO,
		null,
		null,
		[],
		null
	);

	constructor(
		readonly name: string,
		readonly description: RichText,
		readonly status: TaskStatus,
		readonly startDate: Temporal.PlainDate | null,
		readonly endDate: Temporal.PlainDate | null,
		readonly sprintIds: SprintId[],
		readonly keyResult: KeyResultId | null
	) {
		super(
			name,
			description,
			status,
			startDate,
			endDate,
			sprintIds,
			keyResult
		);
	}

	static fromTaskRequestWithDefaults(
		taskRequest: TaskRequest
	): CompleteTaskRequest {
		return new CompleteTaskRequest(
			taskRequest.name === undefined
				? this.taskRequestDefaults.name
				: taskRequest.name,
			taskRequest.description === undefined
				? this.taskRequestDefaults.description
				: taskRequest.description,
			taskRequest.status === undefined
				? this.taskRequestDefaults.status
				: taskRequest.status,
			taskRequest.startDate === undefined
				? this.taskRequestDefaults.startDate
				: taskRequest.startDate,
			taskRequest.endDate === undefined
				? this.taskRequestDefaults.endDate
				: taskRequest.endDate,
			taskRequest.sprintIds === undefined
				? this.taskRequestDefaults.sprintIds
				: taskRequest.sprintIds,
			taskRequest.keyResult === undefined
				? this.taskRequestDefaults.keyResult
				: taskRequest.keyResult
		);
	}
}
