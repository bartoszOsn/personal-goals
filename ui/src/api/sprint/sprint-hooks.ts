import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSprints, deleteSprints, fillSprints, getSprints, updateSprints } from '@/api/sprint/sprint-request';
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

export function useFillSprintsMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => fillSprints(context),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useUpdateSprintsMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: SprintChangeRequest) => updateSprints(context, sprintChangeRequestToDTO(request)),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}

export function useDeleteSprintsMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (ids: SprintId[]) => deleteSprints(context, ids),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['sprint']});
		}
	})
}