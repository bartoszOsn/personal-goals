import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDocument, deleteDocument, getDocumentDetails, getDocuments, updateDocument } from '@/api/document/document-request.ts';
import { documentsRequestToDTO, dtoToDocumentDetails, dtoToDocuments } from '@/api/document/document-converters.ts';
import { DocumentId, DocumentsRequest } from '@/models/Document';

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

export function useUpdateDocument(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (request: DocumentsRequest) => updateDocument(context, documentsRequestToDTO(request)),
		onSuccess: (_, request) => {
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: ['document', context] }),
				...Object.keys(request).map(id => queryClient.invalidateQueries({ queryKey: ['document', 'details', id] }))
			]);
		}
	})
}

export function useDeleteDocumentMutation(context: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (ids: DocumentId[]) => deleteDocument(context, ids),
		onSuccess: (_, variables) => {
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: ['document', context] }),
				...variables.map(id => queryClient.invalidateQueries({ queryKey: ['document', 'details', id] }))
			])
		}
	})
}