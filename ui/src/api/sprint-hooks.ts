import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SprintBulkCreateRequestDTO, SprintListDTO } from '@personal-okr/shared';
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