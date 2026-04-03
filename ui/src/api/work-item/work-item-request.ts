import { http } from '@/base/http';
import {
	WorkItemDTO,
	WorkItemHierarchyCreateRequestDTO,
	WorkItemHierarchyDTO,
	WorkItemHierarchyMoveRequestDTO,
	WorkItemSprintOverviewDTO,
	WorkItemSprintOverviewMoveRequestDTO,
	WorkItemStatusDTO,
	WorkItemsUpdateRequestDTO
} from '@personal-okr/shared';

export function getWorkItemHierarchy(context: number) {
	return http.get<WorkItemHierarchyDTO>(`/api/work-item/hierarchy/${context}`);
}

export function createWorkItemInHierarchy(
	context: number,
	request: WorkItemHierarchyCreateRequestDTO
) {
	return http.post<WorkItemHierarchyDTO, WorkItemHierarchyCreateRequestDTO>(
		`/api/work-item/hierarchy/${context}`,
		request
	);
}

export function updateWorkItemsInHierarchy(
	context: number,
	request: WorkItemsUpdateRequestDTO
) {
	return http.put<WorkItemHierarchyDTO, WorkItemsUpdateRequestDTO>(
		`/api/work-item/hierarchy/${context}`,
		request
	);
}

export function moveWorkItemInHierarchy(
	context: number,
	request: WorkItemHierarchyMoveRequestDTO
) {
	return http.put<WorkItemHierarchyDTO, WorkItemHierarchyMoveRequestDTO>(
		`/api/work-item/hierarchy/${context}/move`,
		request
	);
}

export function deleteWorkItemsInHierarchy(context: number, ids: string[]) {
	return http.delete<WorkItemHierarchyDTO>(
		`/api/work-item/hierarchy/${context}/${ids.join(',')}`
	);
}

export function getWorkItemSprintOverview(sprintId: string) {
	return http.get<WorkItemSprintOverviewDTO>(`/api/work-item/sprint-overview/${sprintId}`);
}

export function createWorkItemInSprintOverview(sprintId: string, status: WorkItemStatusDTO) {
	return http.post<WorkItemSprintOverviewDTO, void>(
		`/api/work-item/sprint-overview/${sprintId}/${status}`,
		undefined
	);
}

export function moveWorkItemInSprintOverview(
	sprintId: string,
	request: WorkItemSprintOverviewMoveRequestDTO
) {
	return http.put<WorkItemSprintOverviewDTO, WorkItemSprintOverviewMoveRequestDTO>(
		`/api/work-item/sprint-overview/${sprintId}/move`,
		request
	);
}

export function getWorkItemDetails(id: string) {
	return http.get<WorkItemDTO>(`/api/work-item/details/${id}`);
}
