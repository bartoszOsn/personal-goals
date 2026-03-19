import { createDocument, deleteDocument, getDocumentDetails, getDocuments, updateDocument } from '@/api/document/document-request.ts';
import { documentsRequestToDTO, dtoToDocumentDetails, dtoToDocuments } from '@/api/document/document-converters.ts';
import { DocumentId, DocumentsRequest } from '@/models/Document';
import { createQuery } from '@/base/query-x/api/createQuery';
import { createMutation } from '@/base/query-x/api/createMutation';

export const useDocumentsQuery = createQuery((_queryClient, context: number) => ({
	queryKey: ['document', context],
	queryFn: () => getDocuments(context).then(dtoToDocuments),
}));

export const useDocumentDetailsQuery = createQuery((_queryClient, documentId: DocumentId) => ({
	queryKey: ['document', 'details', documentId],
	queryFn: () => getDocumentDetails(documentId).then(dtoToDocumentDetails),
}));

export const useCreateDocumentMutation = createMutation((queryClient, context: number) => ({
	mutationFn: () => createDocument(context),
	onSuccess: () => queryClient.invalidateQueries({ queryKey: ['document', context]})
}));

export const useUpdateDocumentMutation = createMutation((queryClient, context: number) => ({
	mutationFn: (request: DocumentsRequest) => updateDocument(context, documentsRequestToDTO(request)),
	onSuccess: (_, request) => {
		return Promise.all([
			queryClient.invalidateQueries({ queryKey: ['document', context] }),
			...Object.keys(request).map(id => queryClient.invalidateQueries({ queryKey: ['document', 'details', id] }))
		]);
	}
}));

export const useDeleteDocumentMutation = createMutation((queryClient, context: number) => ({
	mutationFn: (ids: DocumentId[]) => deleteDocument(context, ids),
	onSuccess: (_, variables) => {
		return Promise.all([
			queryClient.invalidateQueries({ queryKey: ['document', context] }),
			...variables.map(id => queryClient.invalidateQueries({ queryKey: ['document', 'details', id] }))
		])
	}
}));
