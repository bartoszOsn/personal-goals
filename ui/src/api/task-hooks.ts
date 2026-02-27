import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/base/http';
import type { TaskRequestDTO, TaskListDTO } from '@personal-okr/shared';

export function useTasksQuery() {
	return useQuery({
		queryKey: ['tasks'],
		queryFn: () => http.get<TaskListDTO>('/api/work/task')
	})
}

export function useTaskQuery(taskId: string) {
	return useQuery({
		queryKey: ['tasks', taskId],
		queryFn: () => http.get<TaskListDTO>('/api/work/task')
			.then(list => list.tasks.find(task => task.id === taskId)!)
	}); // TODO: add endpoint for fetching single task.
}

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'create'],
		mutationFn: (request: TaskRequestDTO) => http.post('/api/work/task', request),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}

export function useUpdateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'update'],
		mutationFn: ({id, request}: { id: string, request: TaskRequestDTO }) => http.put(`/api/work/task/${id}`, request),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}

export function useDeleteTasksMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'delete'],
		mutationFn: (ids: string[]) => http.delete(`/api/work/task/${ids.join(',')}`),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}