import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SprintBulkCreateRequestDTO, SprintChangeRequestDTO, SprintListDTO } from '@personal-okr/shared';
import { http } from '@/base/http';

export function useSprintQuery() {
	return useQuery({
		queryKey: ['sprint'],
		queryFn: () => http.get<SprintListDTO>('/api/time/sprint'),
	})
}

export function useCreateSprintsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (request: SprintBulkCreateRequestDTO) => {
			await http.post('/api/time/sprint', request);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useUpdateSprintsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (request: SprintChangeRequestDTO) => {
			await http.put('/api/time/sprint', request);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useDeleteSprintsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: string[]) => {
			await http.delete(`/api/time/sprint/${ids.join(',')}`);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}