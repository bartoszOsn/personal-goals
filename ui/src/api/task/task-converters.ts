import { TaskDTO, TaskListDTO, TaskRequestDTO, TaskStatusDTO } from '@personal-okr/shared';
import { Task, TaskId, TaskRequest, TaskStatus } from '@/models/Task.ts';
import { Temporal } from 'temporal-polyfill';
import { SprintId } from '@/models/Sprint.ts';
import { KeyResultId } from '@/models/KeyResult.ts';

export function dtoToTasks(list: TaskListDTO): Task[] {
	return list.tasks.map(dtoToTask);
}

export function dtoToTask(dto: TaskDTO): Task {
	return {
		id: dto.id as TaskId,
		name: dto.name,
		description: dto.description,
		status: dtoToTaskStatus(dto.status),
		startDate: dto.startDate === undefined ? null : Temporal.PlainDate.from(dto.startDate),
		endDate: dto.endDate === undefined ? null : Temporal.PlainDate.from(dto.endDate),
		sprintIds: dto.sprintIds as SprintId[],
		keyResultId: dto.keyResultId === undefined ? null : dto.keyResultId as KeyResultId
	};
}

export function taskRequestToDTO(request: TaskRequest): TaskRequestDTO {
	const dateToDTO = (date?: Temporal.PlainDate | null)=> {
		if (date === undefined) {
			return undefined;
		}

		if (date === null) {
			return { empty: true } as const;
		}

		return { value: date.toString() };
	}

	const krToDTO = (kr?: KeyResultId | null)=> {
		if (kr === undefined) {
			return undefined;
		}

		if (kr === null) {
			return { empty: true } as const;
		}

		return { value: kr };
	}

	return {
		name: request.name,
		description: request.description,
		status: request.status,
		startDate: dateToDTO(request.startDate),
		endDate: dateToDTO(request.endDate),
		sprintIds: request.sprintIds,
		keyResult: krToDTO(request.keyResultId)
	};
}

export function dtoToTaskStatus(dto: TaskStatusDTO): TaskStatus {
	switch (dto) {
		case 'TODO':
			return TaskStatus.TODO;
		case 'IN_PROGRESS':
			return TaskStatus.IN_PROGRESS;
		case 'DONE':
			return TaskStatus.DONE;
		case 'FAILED':
			return TaskStatus.FAILED;
		default:
			throw new Error(`Unknown task ${dto}`);
	}
}