import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskRepository } from './TaskRepository';
import { UserStorage } from '../auth/UserStorage';
import { RichText } from '../../domain/work/model/RichText';
import { TaskStatus } from '../../domain/work/model/TaskStatus';
import { TaskDates } from '../../domain/work/model/TaskDates';
import { SprintId } from '../../domain/time/model/SprintId';
import { Temporal } from 'temporal-polyfill';

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

	async createTask(
		name: string,
		description: string,
		status: TaskStatus,
		dates: { start: Temporal.PlainDate; end: Temporal.PlainDate } | null,
		sprintIds: SprintId[]
	): Promise<Task> {
		const user = await this.userStorage.getUser();
		const task = new Task(
			new TaskId(crypto.randomUUID()),
			name,
			new RichText(description),
			status,
			dates ? new TaskDates(dates.start, dates.end) : null,
			sprintIds
		);
		return this.taskRepository.createTask(user, task);
	}

	async updateTask(
		id: TaskId,
		name?: string,
		description?: string,
		status?: TaskStatus,
		dates?: { start: Temporal.PlainDate; end: Temporal.PlainDate } | null,
		sprintIds?: SprintId[]
	): Promise<void> {
		const user = await this.userStorage.getUser();
		const existingTask = await this.taskRepository.getTaskById(user, id);
		if (!existingTask) {
			throw new Error('Task not found');
		}

		const updatedTask = new Task(
			id,
			name ?? existingTask.name,
			description !== undefined
				? new RichText(description)
				: existingTask.description,
			status ?? existingTask.status,
			dates !== undefined
				? dates
					? new TaskDates(dates.start, dates.end)
					: null
				: existingTask.dates,
			sprintIds ?? existingTask.sprints
		);

		await this.taskRepository.updateTask(user, updatedTask);
	}

	async deleteTask(id: TaskId): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.taskRepository.deleteTask(user, id);
	}
}
