import { http } from '@/base/http';
import { SprintChangeRequestDTO, SprintDTO } from '@personal-okr/shared';

export function getSprints(context: number) {
	return http.get<SprintDTO[]>(`/api/sprint/${context}`);
}

export async function createSprints(context: number) {
	await http.post(`/api/sprint/${context}`, void 0);
}

export async function updateSprints(request: SprintChangeRequestDTO) {
	await http.put('/api/time/sprint', request);
}

export async function deleteSprints(context: number, sprints: string[]) {
	await http.delete(`/api/sprint/${context}/${sprints.join(',')}`);
}