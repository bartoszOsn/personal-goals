import { Injectable } from '@nestjs/common';
import {
	DocumentDetailsDTO,
	DocumentDTO,
	DocumentRequestDTO,
	DocumentsRequestDTO
} from '@personal-okr/shared';
import { Document } from '../../domain/document/model/Document';
import { DocumentUpdateRequest } from '../../domain/document/model/DocumentUpdateRequest';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { DocumentTitle } from '../../domain/document/model/DocumentTitle';
import { DocumentDescription } from '../../domain/document/model/DocumentDescription';

@Injectable()
export class DocumentDTOConverter {
	toDocumentsDTO(documents: Document[]): DocumentDTO[] {
		return documents.map((d) => ({
			id: d.id.id,
			name: d.title.title,
			editedAt: d.editedAt.toString()
		}));
	}

	toDocumentDetailsDTO(document: Document): DocumentDetailsDTO {
		return {
			id: document.id.id,
			name: document.title.title,
			description: document.description.description,
			editedAt: document.editedAt.toString()
		};
	}

	fromDocumentsRequestDTO(
		request: DocumentsRequestDTO
	): DocumentUpdateRequest[] {
		return Object.entries(request).map(
			([id, req]: [string, DocumentRequestDTO]) =>
				new DocumentUpdateRequest(
					new DocumentId(id),
					req.name === undefined
						? undefined
						: new DocumentTitle(req.name),
					req.description === undefined
						? undefined
						: new DocumentDescription(req.description)
				)
		);
	}
}
