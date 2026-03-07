import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createWorkItem,
	deleteWorkItems,
	getWorkItemById,
	getWorkItemsByContext,
	updateWorkItem
} from '@/api/work-item/work-item-request';
import {
	dtoToWorkItem,
	dtoToWorkItems,
	workItemCreationRequestToDTO,
	workItemUpdateRequestToDTO
} from '@/api/work-item/work-item-converters';
import {
	WorkItemCreationRequest,
	WorkItemId,
	WorkItemUpdateRequest
} from '@/models/WorkItem';

export function useWorkItemsByContextQuery(context: number) {
	return useQuery({
		queryKey: ['work-items', 'context', context],
		queryFn: () => getWorkItemsByContext(context).then(dtoToWorkItems)
	});
}

export function useWorkItemQuery(id: string) {
	return useQuery({
		queryKey: ['work-items', id],
		queryFn: () => getWorkItemById(id).then(dtoToWorkItem)
	});
}

export function useCreateWorkItemMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['work-items', 'create'],
		mutationFn: async (request: WorkItemCreationRequest) => {
			const dtoRequest = workItemCreationRequestToDTO(request);
			const result = await createWorkItem(dtoRequest);
			return dtoToWorkItem(result);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
	});
}

export function useUpdateWorkItemMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['work-items', 'update'],
		mutationFn: ({ id, request }: { id: string; request: WorkItemUpdateRequest }) => {
			const dtoRequest = workItemUpdateRequestToDTO(request);
			return updateWorkItem(id, dtoRequest).then(dtoToWorkItem);
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
	});
}

export function useDeleteWorkItemsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['work-items', 'delete'],
		mutationFn: (ids: WorkItemId[]) => deleteWorkItems(ids),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['work-items'] })
	});
}
