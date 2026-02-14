import { User } from '../../domain/auth/model/User';
import { Task } from '../../domain/work/model/Task';
import { TaskId } from '../../domain/work/model/TaskId';

export abstract class TaskRepository {
	abstract getTasks(user: User): Promise<Task[]>;
	abstract getTaskById(user: User, id: TaskId): Promise<Task | null>;
	abstract createTask(user: User, task: Task): Promise<Task>;
	abstract updateTask(user: User, task: Task): Promise<void>;
	abstract deleteTask(user: User, id: TaskId): Promise<void>;
}
