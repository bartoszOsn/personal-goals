import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskRepository } from './TaskRepository';
import { UserStorage } from '../auth/UserStorage';
import { TaskRequest } from '../../domain/work/model/TaskRequest';

@Injectable()
export class TaskService {
	constructor(
		private readonly taskRepository: TaskRepository,
		private readonly userStorage: UserStorage
	) {}

	async getTasks(): Promise<Task[]> {
		const user = await this.userStorage.getUser();
		return this.taskRepository.getTasks(user);
	}

	async getTaskById(id: TaskId): Promise<Task | null> {
		const user = await this.userStorage.getUser();
		return this.taskRepository.getTaskById(user, id);
	}

	async createTask(request: TaskRequest): Promise<Task> {
		const user = await this.userStorage.getUser();
		return this.taskRepository.createTask(user, request);
	}

	async updateTask(id: TaskId, request: TaskRequest): Promise<void> {
		const user = await this.userStorage.getUser();

		await this.taskRepository.updateTask(user, id, request);
	}

	async deleteTask(id: TaskId): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.taskRepository.deleteTask(user, id);
	}
}
