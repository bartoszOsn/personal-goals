import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSprints, deleteSprints, getSprints, updateSprints } from '@/api/sprint/sprint-request';
import { dtoToSprints, sprintChangeRequestToDTO } from './sprint-converters';
import { SprintChangeRequest, SprintId } from '@/models/Sprint';

export function useSprintQuery(context: number) {
	return useQuery({
		queryKey: ['sprint', context],
		queryFn: () => getSprints(context).then(dtoToSprints),
	})
}

export function useCreateSprintsMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => createSprints(context),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useUpdateSprintsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: SprintChangeRequest) => updateSprints(sprintChangeRequestToDTO(request)),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useDeleteSprintsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: SprintId[]) => deleteSprints(ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}