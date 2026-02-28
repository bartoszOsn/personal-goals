import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTasks, getTask, getTasks, updateTask } from '@/api/task/task-request';
import { dtoToTask, dtoToTasks, taskRequestToDTO } from '@/api/task/task-converters';
import { TaskId, TaskRequest } from '@/models/Task';

export function useTasksQuery() {
	return useQuery({
		queryKey: ['tasks'],
		queryFn: () => getTasks()
			.then(dtoToTasks)
	});
}

export function useTaskQuery(taskId: string) {
	return useQuery({
		queryKey: ['tasks', taskId],
		queryFn: () => getTask(taskId)
			.then(dtoToTask)
	});
}

export function useCreateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'create'],
		mutationFn: async (request: TaskRequest) => {
			const dtoRequest = taskRequestToDTO(request);
			await createTask(dtoRequest);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}

export function useUpdateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'update'],
		mutationFn: ({id, request}: { id: string, request: TaskRequest }) => updateTask(id, taskRequestToDTO(request)),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}

export function useDeleteTasksMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['tasks', 'delete'],
		mutationFn: (ids: TaskId[]) => deleteTasks(ids),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks']})
	})
}