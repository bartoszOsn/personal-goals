import { DocumentDetailsDTO, DocumentDTO } from '@personal-okr/shared';
import { Document, DocumentDetails, DocumentId } from '@/models/Document.ts';
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

export function dtoToDocumentDetails(dto: DocumentDetailsDTO): DocumentDetails {
	return {
		...dtoToDocument(dto),
		description: dto.description
	}
}