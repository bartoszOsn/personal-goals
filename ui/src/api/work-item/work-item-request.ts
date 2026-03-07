import { http } from '@/base/http';
import {
	WorkItemCreationRequestDTO,
	WorkItemDTO,
	WorkItemUpdateRequestDTO
} from '@personal-okr/shared';

export function getWorkItemsByContext(context: number) {
	return http.get<WorkItemDTO[]>(`/api/work-item/${context}`);
}

export function getWorkItemById(id: string) {
	return http.get<WorkItemDTO>(`/api/work-item/details/${id}`);
}

export function createWorkItem(request: WorkItemCreationRequestDTO) {
	return http.post<WorkItemDTO, WorkItemCreationRequestDTO>('/api/work-item', request);
}

export function updateWorkItem(id: string, request: WorkItemUpdateRequestDTO) {
	return http.put<WorkItemDTO, WorkItemUpdateRequestDTO>(`/api/work-item/${id}`, request);
}

export function deleteWorkItems(ids: string[]) {
	return http.delete(`/api/work-item/${ids.join(',')}`);
}
