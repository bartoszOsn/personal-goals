import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskStatus } from '../../domain/work/model/TaskStatus';
import {
	TaskDTO,
	TaskListDTO,
	TaskCreateRequestDTO,
	TaskUpdateRequestDTO
} from '@personal-okr/shared';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';

@Injectable()
export class TaskDTOConverter {
	toTaskDTO(task: Task): TaskDTO {
		return {
			id: task.id.id,
			name: task.name,
			description: task.description.markdown,
			status: this.toTaskStatusDTO(task.status),
			dates: task.dates
				? {
						start: task.dates.start.toString(),
						end: task.dates.end.toString()
					}
				: null,
			sprintIds: task.sprints.map((sprint) => sprint.value)
		};
	}

	toTaskListDTO(tasks: Task[]): TaskListDTO {
		return {
			tasks: tasks.map((task) => this.toTaskDTO(task))
		};
	}

	fromTaskCreateRequestDTO(dto: TaskCreateRequestDTO): {
		name: string;
		description: string;
		status: TaskStatus;
		dates: { start: Temporal.PlainDate; end: Temporal.PlainDate } | null;
		sprintIds: SprintId[];
	} {
		return {
			name: dto.name,
			description: dto.description,
			status: this.fromTaskStatusDTO(dto.status),
			dates: dto.dates
				? {
						start: Temporal.PlainDate.from(dto.dates.start),
						end: Temporal.PlainDate.from(dto.dates.end)
					}
				: null,
			sprintIds: dto.sprintIds.map((id) => new SprintId(id))
		};
	}

	fromTaskUpdateRequestDTO(dto: TaskUpdateRequestDTO): {
		name?: string;
		description?: string;
		status?: TaskStatus;
		dates?: { start: Temporal.PlainDate; end: Temporal.PlainDate } | null;
		sprintIds?: SprintId[];
	} {
		return {
			name: dto.name,
			description: dto.description,
			status: dto.status
				? this.fromTaskStatusDTO(dto.status)
				: undefined,
			dates:
				dto.dates !== undefined
					? dto.dates
						? {
								start: Temporal.PlainDate.from(dto.dates.start),
								end: Temporal.PlainDate.from(dto.dates.end)
							}
						: null
					: undefined,
			sprintIds: dto.sprintIds?.map((id) => new SprintId(id))
		};
	}

	private toTaskStatusDTO(status: TaskStatus): TaskDTO['status'] {
		switch (status) {
			case TaskStatus.TODO:
				return 'TODO';
			case TaskStatus.IN_PROGRESS:
				return 'IN_PROGRESS';
			case TaskStatus.DONE:
				return 'DONE';
			case TaskStatus.FAILED:
				return 'FAILED';
			default:
				throw new UnreachableError(status);
		}
	}

	private fromTaskStatusDTO(status: TaskDTO['status']): TaskStatus {
		switch (status) {
			case 'TODO':
				return TaskStatus.TODO;
			case 'IN_PROGRESS':
				return TaskStatus.IN_PROGRESS;
			case 'DONE':
				return TaskStatus.DONE;
			case 'FAILED':
				return TaskStatus.FAILED;
			default:
				throw new UnreachableError(status);
		}
	}
}
