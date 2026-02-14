import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Put
} from '@nestjs/common';
import { TaskService } from '../../app/work/TaskService';
import { TaskDTOConverter } from './TaskDTOConverter';
import type {
	TaskDTO,
	TaskListDTO,
	TaskCreateRequestDTO,
	TaskUpdateRequestDTO
} from '@personal-okr/shared';
import { TaskId } from '../../domain/work/model/TaskId';

@Controller('work/task')
export class TaskController {
	constructor(
		private readonly taskService: TaskService,
		private readonly taskDTOConverter: TaskDTOConverter
	) {}

	@Get()
	public async getTasks(): Promise<TaskListDTO> {
		const tasks = await this.taskService.getTasks();
		return this.taskDTOConverter.toTaskListDTO(tasks);
	}

	@Get(':id')
	public async getTaskById(@Param('id') id: string): Promise<TaskDTO> {
		const task = await this.taskService.getTaskById(new TaskId(id));
		if (!task) {
			throw new NotFoundException('Task not found');
		}
		return this.taskDTOConverter.toTaskDTO(task);
	}

	@Post()
	public async createTask(
		@Body() request: TaskCreateRequestDTO
	): Promise<TaskDTO> {
		const { name, description, status, dates, sprintIds } =
			this.taskDTOConverter.fromTaskCreateRequestDTO(request);
		const task = await this.taskService.createTask(
			name,
			description,
			status,
			dates,
			sprintIds
		);
		return this.taskDTOConverter.toTaskDTO(task);
	}

	@Put(':id')
	public async updateTask(
		@Param('id') id: string,
		@Body() request: TaskUpdateRequestDTO
	): Promise<void> {
		const { name, description, status, dates, sprintIds } =
			this.taskDTOConverter.fromTaskUpdateRequestDTO(request);
		await this.taskService.updateTask(
			new TaskId(id),
			name,
			description,
			status,
			dates,
			sprintIds
		);
	}

	@Delete(':id')
	public async deleteTask(@Param('id') id: string): Promise<void> {
		await this.taskService.deleteTask(new TaskId(id));
	}
}
