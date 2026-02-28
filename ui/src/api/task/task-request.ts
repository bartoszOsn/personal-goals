import { http } from '@/base/http';
import { TaskListDTO, TaskRequestDTO } from '@personal-okr/shared';

export function getTasks() {
	return http.get<TaskListDTO>('/api/work/task');
}

// TODO: add endpoint for fetching single task.
export async function getTask(id: string) {
	const list = await getTasks();
	return list.tasks.find(task => task.id === id)!;
}

export function createTask(request: TaskRequestDTO) {
	return http.post('/api/work/task', request);
}

export function updateTask(id: string, request: TaskRequestDTO) {
	return http.put(`/api/work/task/${id}`, request);
}

export function deleteTasks(ids: string[]) {
	return http.delete(`/api/work/task/${ids.join(',')}`);
}