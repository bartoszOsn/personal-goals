import { http } from '@/base/http';
import { KeyResultRequestDTO, ObjectiveListDTO, ObjectiveRequestDTO } from '@personal-okr/shared';

export function getOKR() {
	return http.get<ObjectiveListDTO>('/api/work/okr/objective');
}

export function createOKR(request: ObjectiveRequestDTO) {
	return http.post('/api/work/okr/objective', request);
}

export function deleteOKR(objectiveId: string) {
	return http.delete(`/api/work/okr/objective/${objectiveId}`);
}

export function createKeyResult(objectiveId: string, request: KeyResultRequestDTO) {
	return http.post(`/api/work/okr/key-result/${objectiveId}`, request)
}

export function deleteKeyResult(keyResultId: string) {
	return http.delete(`/api/work/okr/key-result/${keyResultId}`);
}