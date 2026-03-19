import { createSprints, deleteSprints, fillSprints, getSprints, updateSprints } from '@/api/sprint/sprint-request';
import { dtoToSprints, sprintChangeRequestToDTO } from './sprint-converters';
import { SprintChangeRequest, SprintId } from '@/models/Sprint';
import { createMutation } from '@/base/query-x/api/createMutation';
import { createQuery } from '@/base/query-x/api/createQuery';

export const useSprintQuery = createQuery((_queryClient, context: number) => ({
	queryKey: ['sprint', context],
	queryFn: () => getSprints(context).then(dtoToSprints),
}));

export const useCreateSprintsMutation = createMutation((queryClient, context: number) => ({
	mutationFn: () => createSprints(context),
	onSuccess: async () => {
		await queryClient.invalidateQueries({ queryKey: ['sprint']});
	}
}));

export const useFillSprintsMutation = createMutation((queryClient, context: number) => ({
	mutationFn: () => fillSprints(context),
	onSuccess: async () => {
		await queryClient.invalidateQueries({ queryKey: ['sprint']});
	}
}))

export const useUpdateSprintsMutation = createMutation((queryClient, context: number) => ({
	mutationFn: (request: SprintChangeRequest) => updateSprints(context, sprintChangeRequestToDTO(request)),
	onSuccess: async () => {
		await queryClient.invalidateQueries({ queryKey: ['sprint']});
	}
}));

export const useDeleteSprintsMutation = createMutation((queryClient, context: number) => ({
	mutationFn: async (ids: SprintId[]) => deleteSprints(context, ids),
	onSuccess: async () => {
		await queryClient.invalidateQueries({ queryKey: ['sprint']});
	}
}));