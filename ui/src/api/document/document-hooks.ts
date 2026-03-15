import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDocument, getDocumentDetails, getDocuments } from '@/api/document/document-request.ts';
import { dtoToDocumentDetails, dtoToDocuments } from '@/api/document/document-converters.ts';
import { DocumentId } from '@/models/Document';

export function useDocumentsQuery(context: number) {
	return useQuery({
		queryKey: ['document', context],
		queryFn: () => getDocuments(context).then(dtoToDocuments),
	})
}

export function useDocumentDetailsQuery(documentId: DocumentId) {
	return useQuery({
		queryKey: ['document', 'details', documentId],
		queryFn: () => getDocumentDetails(documentId).then(dtoToDocumentDetails),
	})
}

export function useCreateDocumentMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => createDocument(context),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document', context]})
	})
}