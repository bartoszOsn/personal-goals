import { http } from '@/base/http';
import { SprintBulkCreateRequestDTO, SprintChangeRequestDTO, SprintListDTO } from '@personal-okr/shared';

export function getSprints() {
	return http.get<SprintListDTO>('/api/time/sprint');
}

export async function createSprints(request: SprintBulkCreateRequestDTO) {
	await http.post('/api/time/sprint', request);
}

export async function updateSprints(request: SprintChangeRequestDTO) {
	await http.put('/api/time/sprint', request);
}

export async function deleteSprints(sprints: string[]) {
	await http.delete(`/api/time/sprint/${sprints.join(',')}`);
}