import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDocument, getDocuments } from '@/api/document/document-request.ts';
import { dtoToDocuments } from '@/api/document/document-converters.ts';

export function useDocumentsQuery(context: number) {
	return useQuery({
		queryKey: ['document', context],
		queryFn: () => getDocuments(context).then(dtoToDocuments),
	})
}

export function useCreateDocumentMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => createDocument(context),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document', context]})
	})
}