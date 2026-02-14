import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../../app/work/TaskRepository';
import { User } from '../../domain/auth/model/User';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskEntity } from './entity/TaskEntity';
import { TaskEntityConverter } from './TaskEntityConverter';
import { UserEntity } from '../auth/entity/UserEntity';

@Injectable()
export class TaskRepositoryImpl extends TaskRepository {
	constructor(
		@InjectRepository(TaskEntity)
		private readonly taskEntityRepository: Repository<TaskEntity>,
		private readonly taskEntityConverter: TaskEntityConverter
	) {
		super();
	}

	async getTasks(user: User): Promise<Task[]> {
		const entities = await this.taskEntityRepository.find({
			where: { user: { id: user.id.id } },
			relations: ['sprints']
		});
		return this.taskEntityConverter.fromTaskEntities(entities);
	}

	async getTaskById(user: User, id: TaskId): Promise<Task | null> {
		const entity = await this.taskEntityRepository.findOne({
			where: {
				user: { id: user.id.id },
				id: id.id
			},
			relations: ['sprints']
		});

		if (!entity) {
			return null;
		}

		return this.taskEntityConverter.fromTaskEntity(entity);
	}

	async createTask(user: User, task: Task): Promise<Task> {
		const entity = new TaskEntity();
		Object.assign(entity, this.taskEntityConverter.toTaskEntityData(task));
		entity.user = { id: user.id.id } as unknown as UserEntity;
		entity.sprints = this.taskEntityConverter.sprintIdsToEntities(
			task.sprints
		);

		const createdEntity = await this.taskEntityRepository.save(entity);
		return this.taskEntityConverter.fromTaskEntity(createdEntity);
	}

	async updateTask(user: User, task: Task): Promise<void> {
		const entity = await this.taskEntityRepository.findOne({
			where: {
				user: { id: user.id.id },
				id: task.id.id
			},
			relations: ['sprints']
		});

		if (!entity) {
			throw new Error('Task not found');
		}

		Object.assign(entity, this.taskEntityConverter.toTaskEntityData(task));
		entity.sprints = this.taskEntityConverter.sprintIdsToEntities(
			task.sprints
		);

		await this.taskEntityRepository.save(entity);
	}

	async deleteTask(user: User, id: TaskId): Promise<void> {
		await this.taskEntityRepository.delete({
			user: { id: user.id.id },
			id: id.id
		});
	}
}
