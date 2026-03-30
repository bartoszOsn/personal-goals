import { http } from '@/base/http';
import {
	WorkItemCreationRequestDTOOld,
	WorkItemDTOOld,
	WorkItemUpdateRequestDTOOld
} from '@personal-okr/shared';

export function getWorkItemsByContext(context: number) {
	return http.get<WorkItemDTOOld[]>(`/api/work-item/${context}`);
}

export function getWorkItemById(id: string) {
	return http.get<WorkItemDTOOld>(`/api/work-item/details/${id}`);
}

export function createWorkItem(request: WorkItemCreationRequestDTOOld) {
	return http.post<WorkItemDTOOld, WorkItemCreationRequestDTOOld>('/api/work-item', request);
}

export function updateWorkItem(id: string, request: WorkItemUpdateRequestDTOOld) {
	return http.put<WorkItemDTOOld, WorkItemUpdateRequestDTOOld>(`/api/work-item/${id}`, request);
}

export function deleteWorkItems(ids: string[]) {
	return http.delete(`/api/work-item/${ids.join(',')}`);
}
