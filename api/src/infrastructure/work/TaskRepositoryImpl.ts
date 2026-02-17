import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../../app/work/TaskRepository';
import { User } from '../../domain/auth/model/User';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskEntity } from './entity/TaskEntity';
import { TaskEntityConverter } from './TaskEntityConverter';
import { UserEntity } from '../auth/entity/UserEntity';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { CompleteTaskRequest } from '../../domain/work/model/CompleteTaskRequest';

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

	async createTask(user: User, task: CompleteTaskRequest): Promise<Task> {
		const entity = this.taskEntityConverter.toTaskEntityPartial(task);
		entity.user = { id: user.id.id } as unknown as UserEntity;

		const createdEntity = await this.taskEntityRepository.save(entity);
		return this.taskEntityConverter.fromTaskEntity(createdEntity);
	}

	async updateTask(
		user: User,
		id: TaskId,
		request: TaskRequest
	): Promise<void> {
		const entity = this.taskEntityConverter.toTaskEntityPartial(request);

		const result = await this.taskEntityRepository.update(
			{
				id: id.id,
				user: { id: user.id.id }
			},
			entity
		);

		if (!result.affected || result.affected === 0) {
			throw new NotFoundException(); // TODO: Change to application exception
		}
	}

	async deleteTask(user: User, id: TaskId): Promise<void> {
		const result = await this.taskEntityRepository.delete({
			user: { id: user.id.id },
			id: id.id
		});

		if (!result.affected || result.affected === 0) {
			throw new NotFoundException(); // TODO: Change to application exception
		}
	}
}
