import { DocumentDTO } from '@personal-okr/shared';
import { Document, DocumentId } from '@/models/Document.ts';
import { Temporal } from 'temporal-polyfill';

export function dtoToDocuments(dtos: DocumentDTO[]): Document[] {
	return dtos.map(dtoToDocument);
}

export function dtoToDocument(dto: DocumentDTO): Document {
	return {
		id: dto.id as DocumentId,
		name: dto.name,
		editedAt: Temporal.PlainDateTime.from(dto.editedAt)
	}
}