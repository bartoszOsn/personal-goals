import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskStatus } from '../../domain/work/model/TaskStatus';
import { TaskDTO, TaskListDTO, TaskRequestDTO } from '@personal-okr/shared';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { RichText } from '../../domain/work/model/RichText';

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
			sprintIds: task.sprints.map((sprint) => sprint.value)
		};
	}

	toTaskListDTO(tasks: Task[]): TaskListDTO {
		return {
			tasks: tasks.map((task) => this.toTaskDTO(task))
		};
	}

	fromTaskRequestDTO(dto: TaskRequestDTO): TaskRequest {
		return new TaskRequest(
			dto.name,
			new RichText(dto.description),
			this.fromTaskStatusDTO(dto.status),
			dto.startDate ? Temporal.PlainDate.from(dto.startDate) : null,
			dto.endDate ? Temporal.PlainDate.from(dto.endDate) : null,
			dto.sprintIds.map((id) => new SprintId(id))
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
