import { Injectable } from '@nestjs/common';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { Document } from '../../domain/document/model/Document';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { DocumentUpdateRequest } from '../../domain/document/model/DocumentUpdateRequest';
import { DocumentRepository } from './DocumentRepository';
import { Temporal } from 'temporal-polyfill';
import { UserStorage } from '../auth/UserStorage';
import { DocumentNotFoundError } from '../../domain/document/error/DocumentNotFoundError';

@Injectable()
export class DocumentService {
	constructor(
		private readonly documentRepository: DocumentRepository,
		private readonly userStorage: UserStorage
	) {}

	async getDocumentsByContext(context: ContextYear): Promise<Document[]> {
		const user = await this.userStorage.getUser();
		return this.documentRepository.findByContext(context, user);
	}

	async getDocumentById(id: DocumentId): Promise<Document> {
		const user = await this.userStorage.getUser();
		const document = await this.documentRepository.findById(id, user);
		if (!document) {
			throw new DocumentNotFoundError(`Document not found`);
		}
		return document;
	}

	async createDocument(context: ContextYear): Promise<Document[]> {
		const user = await this.userStorage.getUser();
		const newDocument = Document.defaultDocument(
			context,
			Temporal.Now.plainDateTimeISO()
		);
		await this.documentRepository.saveDocuments([newDocument], user);
		return this.documentRepository.findByContext(context, user);
	}

	async updateDocuments(
		context: ContextYear,
		requests: DocumentUpdateRequest[]
	): Promise<Document[]> {
		const user = await this.userStorage.getUser();
		const now = Temporal.Now.plainDateTimeISO();
		const documents = await this.getDocumentsByContext(context);
		const updatedDocuments = documents
			.filter((d) => requests.some((req) => d.id.equals(req.id)))
			.map((document) => {
				const request = requests.find((r) => r.id.equals(document.id));
				if (!request) return document;
				return document.updated(request, now);
			});
		await this.documentRepository.saveDocuments(updatedDocuments, user);
		return await this.getDocumentsByContext(context);
	}

	async deleteDocuments(
		context: ContextYear,
		ids: DocumentId[]
	): Promise<Document[]> {
		const user = await this.userStorage.getUser();
		await this.documentRepository.deleteDocuments(ids, user);
		return this.documentRepository.findByContext(context, user);
	}
}
