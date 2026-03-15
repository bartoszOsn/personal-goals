import { http } from '@/base/http';
import { DocumentDetailsDTO, DocumentDTO } from '@personal-okr/shared';
import { DocumentId } from '@/models/Document';

export function getDocuments(context: number) {
	return http.get<DocumentDTO[]>(`/api/document/${context}`);
}

export function getDocumentDetails(documentId: DocumentId) {
	return http.get<DocumentDetailsDTO>(`/api/document/details/${documentId}`);
}

export function createDocument(context: number) {
	return http.post(`/api/document/${context}`, void 0);
}
