import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { http } from '@/base/http';
import type { KeyResultRequestDTO, ObjectiveListDTO, ObjectiveRequestDTO } from '@personal-okr/shared';

export function useOkrQuery() {
	return useQuery({
		queryKey: ['okr'],
		queryFn: () => http.get<ObjectiveListDTO>('/api/work/okr/objective')
	});
}

export function useOkrCreateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (request: ObjectiveRequestDTO) => http.post('/api/work/okr/objective', request),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}

export function useKeyResultCreateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (props: { objectiveId: string, request: KeyResultRequestDTO }) => http.post(`/api/work/okr/key-result/${props.objectiveId}`, props.request),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}