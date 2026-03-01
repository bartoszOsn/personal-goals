import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createKeyResult, createOKR, deleteKeyResult, deleteOKR, getOKR, updateKeyResult, updateOKR } from '@/api/okr/okr-request';
import { dtoToObjectives, objectiveRequestToDTO } from '@/api/okr/okr-converters';
import { ObjectiveId, ObjectiveRequest } from '@/models/Objective';
import { KeyResultId, KeyResultRequest } from '@/models/KeyResult';

export function useOkrQuery() {
	return useQuery({
		queryKey: ['okr'],
		queryFn: () => getOKR()
			.then(dtoToObjectives)
	});
}

export function useOkrCreateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (request: ObjectiveRequest) => createOKR(objectiveRequestToDTO(request)),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}

export function useOKRUpdateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (props: { id: ObjectiveId, request: ObjectiveRequest }) => updateOKR(props.id, objectiveRequestToDTO(props.request)),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	})
}

export function useOkrDeleteMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (objectiveId: ObjectiveId) => deleteOKR(objectiveId),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	})
}

export function useKeyResultCreateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (props: { objectiveId: ObjectiveId, request: KeyResultRequest }) => createKeyResult(props.objectiveId, props.request),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}

export function useKeyResultUpdateMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (props: { id: KeyResultId, request: KeyResultRequest }) => updateKeyResult(props.id, props.request),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}

export function useKeyResultDeleteMutation() {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (keyResultId: KeyResultId) => deleteKeyResult(keyResultId),
		onSuccess: () => client.invalidateQueries({ queryKey: ['okr'] })
	});
}