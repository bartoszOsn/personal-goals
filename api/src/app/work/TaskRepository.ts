import { User } from '../../domain/auth/model/User';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';
import { TaskRequest } from '../../domain/work/model/TaskRequest';
import { CompleteTaskRequest } from '../../domain/work/model/CompleteTaskRequest';

export abstract class TaskRepository {
	abstract getTasks(user: User): Promise<Task[]>;
	abstract getTaskById(user: User, id: TaskId): Promise<Task | null>;
	abstract createTask(user: User, task: CompleteTaskRequest): Promise<Task>;
	abstract updateTask(
		user: User,
		id: TaskId,
		request: TaskRequest
	): Promise<void>;
	abstract deleteTask(user: User, id: TaskId): Promise<void>;
}
