import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskRepository } from './TaskRepository';
import { UserStorage } from '../auth/UserStorage';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { CompleteTaskRequest } from '../../domain/work/model/CompleteTaskRequest';

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
		const requestWithDefaults =
			CompleteTaskRequest.fromTaskRequestWithDefaults(request);
		return this.taskRepository.createTask(user, requestWithDefaults);
	}

	async updateTask(id: TaskId, request: TaskRequest): Promise<void> {
		const user = await this.userStorage.getUser();

		await this.taskRepository.updateTask(user, id, request);
	}

	async deleteTasks(ids: TaskId[]): Promise<void> {
		const user = await this.userStorage.getUser();
		for (const id of ids) {
			await this.taskRepository.deleteTask(user, id);
		}
	}
}
