import { http } from '@/base/http';
import { SprintDTO, SprintsUpdateRequestDTO } from '@personal-okr/shared';

export function getSprints(context: number) {
	return http.get<SprintDTO[]>(`/api/sprint/${context}`);
}

export async function createSprints(context: number) {
	await http.post(`/api/sprint/${context}`, void 0);
}

export async function fillSprints(context: number) {
	await http.post(`/api/sprint/${context}/fill`, void 0);
}

export async function updateSprints(context: number, request: SprintsUpdateRequestDTO) {
	await http.put(`/api/sprint/${context}`, request);
}

export async function deleteSprints(context: number, sprints: string[]) {
	await http.delete(`/api/sprint/${context}/${sprints.join(',')}`);
}