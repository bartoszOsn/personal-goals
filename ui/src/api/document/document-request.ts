import { http } from '@/base/http';
import { DocumentDTO } from '@personal-okr/shared';

export function getDocuments(context: number) {
	return http.get<DocumentDTO[]>(`/api/document/${context}`);
}

export function createDocument(context: number) {
	return http.post(`/api/document/${context}`, void 0);
}
