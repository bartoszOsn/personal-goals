import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskStatus } from '../../domain/work/model/TaskStatus';
import { TaskDTO, TaskListDTO, TaskRequestDTO } from '@personal-okr/shared';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { RichText } from '../../domain/work/model/RichText';
import { KeyResultId } from '../../domain/work/model/KeyResult';

@Injectable()
export class TaskDTOConverter {
	toTaskDTO(task: Task): TaskDTO {
		return {
			id: task.id.id,
			name: task.name,
			description: task.description.markdown,
			status: this.toTaskStatusDTO(task.status),
			startDate: task.startDate?.toString() ?? undefined,
			endDate: task.endDate?.toString() ?? undefined,
			sprintIds: task.sprints.map((sprint) => sprint.value),
			keyResultId: task.keyResultId?.id ?? undefined
		};
	}

	toTaskListDTO(tasks: Task[]): TaskListDTO {
		return {
			tasks: tasks.map((task) => this.toTaskDTO(task))
		};
	}

	fromTaskRequestDTO(dto: TaskRequestDTO): TaskRequest {
		const dateToDomain = (date: TaskRequestDTO['startDate']) => {
			if (date === undefined) {
				return undefined;
			}
			if ('empty' in date) {
				return null;
			}
			return Temporal.PlainDate.from(date.value);
		};

		const keyResultToDomain = (keyResult: TaskRequestDTO['keyResult']) => {
			if (keyResult === undefined) {
				return undefined;
			}

			if ('empty' in keyResult) {
				return null;
			}

			return new KeyResultId(keyResult.value);
		};

		return new TaskRequest(
			dto.name,
			dto.description ? new RichText(dto.description) : undefined,
			dto.status ? this.fromTaskStatusDTO(dto.status) : undefined,
			dateToDomain(dto.startDate),
			dateToDomain(dto.endDate),
			dto.sprintIds?.map((id) => new SprintId(id)),
			keyResultToDomain(dto.keyResult)
		);
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
