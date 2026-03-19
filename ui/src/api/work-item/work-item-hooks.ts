import { createWorkItem, deleteWorkItems, getWorkItemById, getWorkItemsByContext, updateWorkItem } from '@/api/work-item/work-item-request';
import { dtoToWorkItem, dtoToWorkItems, workItemCreationRequestToDTO, workItemUpdateRequestToDTO } from '@/api/work-item/work-item-converters';
import { WorkItemCreationRequest, WorkItemId, WorkItemUpdateRequest } from '@/models/WorkItem';
import { createQuery } from '@/base/query-x/api/createQuery';
import { createMutation } from '@/base/query-x/api/createMutation';

export const useWorkItemsByContextQuery = createQuery((_queryClient, context: number) => ({
	queryKey: ['work-items', 'context', context],
	queryFn: () => getWorkItemsByContext(context).then(dtoToWorkItems)
}));

export const useWorkItemQuery = createQuery((_queryClient, id: WorkItemId) => ({
	queryKey: ['work-items', id],
	queryFn: () => getWorkItemById(id).then(dtoToWorkItem)
}));

export const useCreateWorkItemMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'create'],
	mutationFn: async (request: WorkItemCreationRequest) => {
		const dtoRequest = workItemCreationRequestToDTO(request);
		const result = await createWorkItem(dtoRequest);
		return dtoToWorkItem(result);
	},
	onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
}));

export const useUpdateWorkItemMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'update'],
	mutationFn: ({ id, request }: { id: string; request: WorkItemUpdateRequest }) => {
		const dtoRequest = workItemUpdateRequestToDTO(request);
		return updateWorkItem(id, dtoRequest).then(dtoToWorkItem);
	},
	onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
}));

export const useDeleteWorkItemsMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'delete'],
	mutationFn: (ids: WorkItemId[]) => deleteWorkItems(ids),
	onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
}));
