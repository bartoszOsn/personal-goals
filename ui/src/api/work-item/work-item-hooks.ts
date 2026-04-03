import { createQuery } from '@/base/query-x/api/createQuery';
import { createMutation } from '@/base/query-x/api/createMutation';
import {
	createWorkItemInHierarchy,
	createWorkItemInSprintOverview,
	deleteWorkItemsInHierarchy,
	getWorkItemDetails,
	getWorkItemHierarchy,
	getWorkItemSprintOverview,
	moveWorkItemInHierarchy,
	moveWorkItemInSprintOverview,
	updateWorkItemsInHierarchy
} from '@/api/work-item/work-item-request';
import {
	dtoToWorkItem,
	dtoToWorkItemHierarchy,
	dtoToWorkItemSprintOverview,
	workItemHierarchyCreateRequestToDTO,
	workItemHierarchyMoveRequestToDTO,
	workItemSprintOverviewMoveRequestToDTO,
	workItemsUpdateRequestToDTO,
	workItemStatusToDTO
} from '@/api/work-item/work-item-converters';
import {
	WorkItemHierarchyCreateRequest,
	WorkItemHierarchyMoveRequest,
	WorkItemId,
	WorkItemSprintOverviewMoveRequest,
	WorkItemsUpdateRequest,
	WorkItemStatus
} from '@/models/WorkItem';
import { SprintId } from '@/models/Sprint';

// Hierarchy queries and mutations
export const useWorkItemHierarchyQuery = createQuery((_queryClient, context: number) => ({
	queryKey: ['work-items', 'hierarchy', context],
	queryFn: () => getWorkItemHierarchy(context).then(dtoToWorkItemHierarchy)
}));

export const useCreateWorkItemInHierarchyMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'hierarchy', 'create'],
	mutationFn: async (request: WorkItemHierarchyCreateRequest) => {
		const dtoRequest = workItemHierarchyCreateRequestToDTO(request);
		const result = await createWorkItemInHierarchy(request.context, dtoRequest);
		return dtoToWorkItemHierarchy(result);
	},
	onSuccess: async (data) => {
		await queryClient.invalidateQueries({ queryKey: ['work-items', 'hierarchy', data.context] });
	}
}));

export const useUpdateWorkItemsInHierarchyMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'hierarchy', 'update'],
	mutationFn: async ({ context, request }: { context: number; request: WorkItemsUpdateRequest }) => {
		const dtoRequest = workItemsUpdateRequestToDTO(request);
		const result = await updateWorkItemsInHierarchy(context, dtoRequest);
		return dtoToWorkItemHierarchy(result);
	},
	onSuccess: async (data) => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['work-items', 'details'] }),
			queryClient.invalidateQueries({ queryKey: ['work-items', 'sprint-overview'] }),
			queryClient.invalidateQueries({ queryKey: ['work-items', 'hierarchy', data.context] })
		])
	}
}));

export const useMoveWorkItemInHierarchyMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'hierarchy', 'move'],
	mutationFn: async ({ context, request }: { context: number; request: WorkItemHierarchyMoveRequest }) => {
		const dtoRequest = workItemHierarchyMoveRequestToDTO(request);
		const result = await moveWorkItemInHierarchy(context, dtoRequest);
		return dtoToWorkItemHierarchy(result);
	},
	onSuccess: async (data) => {
		await queryClient.invalidateQueries({ queryKey: ['work-items', 'hierarchy', data.context] });
	}
}));

export const useDeleteWorkItemsInHierarchyMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'hierarchy', 'delete'],
	mutationFn: async ({ context, ids }: { context: number; ids: WorkItemId[] }) => {
		const result = await deleteWorkItemsInHierarchy(context, ids);
		return dtoToWorkItemHierarchy(result);
	},
	onSuccess: async (data) => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['work-items', 'hierarchy', data.context] }),
			queryClient.invalidateQueries({ queryKey: ['work-items', 'sprint-overview'] })
		]);
	}
}));

// Sprint overview queries and mutations
export const useWorkItemSprintOverviewQuery = createQuery((_queryClient, sprintId: SprintId) => ({
	queryKey: ['work-items', 'sprint-overview', sprintId],
	queryFn: () => getWorkItemSprintOverview(sprintId).then(dtoToWorkItemSprintOverview)
}));

export const useCreateWorkItemInSprintOverviewMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'sprint-overview', 'create'],
	mutationFn: async ({ sprintId, status }: { sprintId: SprintId; status: WorkItemStatus }) => {
		const statusDTO = workItemStatusToDTO(status);
		const result = await createWorkItemInSprintOverview(sprintId, statusDTO);
		return dtoToWorkItemSprintOverview(result);
	},
	onSuccess: async (data) => {
		await queryClient.invalidateQueries({ queryKey: ['work-items', 'sprint-overview', data.sprintId] });
	}
}));

export const useMoveWorkItemInSprintOverviewMutation = createMutation((queryClient) => ({
	mutationKey: ['work-items', 'sprint-overview', 'move'],
	mutationFn: async ({ sprintId, request }: { sprintId: SprintId; request: WorkItemSprintOverviewMoveRequest }) => {
		const dtoRequest = workItemSprintOverviewMoveRequestToDTO(request);
		const result = await moveWorkItemInSprintOverview(sprintId, dtoRequest);
		return dtoToWorkItemSprintOverview(result);
	},
	onSuccess: async (data) => {
		await queryClient.invalidateQueries({ queryKey: ['work-items', 'sprint-overview', data.sprintId] });
	}
}));

// Work item details query
export const useWorkItemDetailsQuery = createQuery((_queryClient, id: WorkItemId) => ({
	queryKey: ['work-items', 'details', id],
	queryFn: () => getWorkItemDetails(id).then(dtoToWorkItem)
}));
