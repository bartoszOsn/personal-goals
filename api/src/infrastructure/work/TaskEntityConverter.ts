import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskEntity } from './entity/TaskEntity';
import { TaskId } from '../../domain/work/model/TaskId';
import { RichText } from '../../domain/work/model/RichText';
import { TaskStatus } from '../../domain/work/model/TaskStatus';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintTimeRangeEntity } from '../time/entity/SprintTimeRangeEntity';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class TaskEntityConverter {
	constructor(
		@InjectRepository(TaskEntity)
		private readonly taskEntityRepository: Repository<TaskEntity>
	) {}

	fromTaskEntity(entity: TaskEntity): Task {
		return new Task(
			new TaskId(entity.id),
			entity.name,
			new RichText(entity.description),
			this.fromTaskStatusString(entity.status),
			entity.startDate ? Temporal.PlainDate.from(entity.startDate) : null,
			entity.endDate ? Temporal.PlainDate.from(entity.endDate) : null,
			entity.sprints?.map((sprint) => new SprintId(sprint.id)) ?? []
		);
	}

	fromTaskEntities(entities: TaskEntity[]): Task[] {
		return entities.map((entity) => this.fromTaskEntity(entity));
	}

	toTaskEntityPartial(task: TaskRequest): TaskEntity {
		const partial: DeepPartial<TaskEntity> = {};
		if (task.name !== undefined) {
			partial.name = task.name;
		}
		if (task.description !== undefined) {
			partial.description = task.description.markdown;
		}
		if (task.status !== undefined) {
			partial.status = this.toTaskStatusString(task.status);
		}
		if (task.startDate !== undefined) {
			partial.startDate = task.startDate
				? task.startDate.toString()
				: undefined;
		}
		if (task.endDate !== undefined) {
			partial.endDate = task.endDate
				? task.endDate.toString()
				: undefined;
		}

		return this.taskEntityRepository.create(partial);
	}

	sprintIdsToEntities(sprintIds: SprintId[]): SprintTimeRangeEntity[] {
		return sprintIds.map((sprintId) => {
			const entity = new SprintTimeRangeEntity();
			entity.id = sprintId.value;
			return entity;
		});
	}

	private fromTaskStatusString(status: string): TaskStatus {
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
				throw new UnreachableError(status as never);
		}
	}

	private toTaskStatusString(status: TaskStatus): string {
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
}
