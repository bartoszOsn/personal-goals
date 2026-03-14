import { Injectable } from '@nestjs/common';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { Document } from '../../domain/document/model/Document';
import { User } from '../../domain/auth/model/User';

@Injectable()
export abstract class DocumentRepository {
	abstract findByContext(
		context: ContextYear,
		user: User
	): Promise<Document[]>;
	abstract findById(id: DocumentId, user: User): Promise<Document | null>;
	abstract saveDocuments(
		documents: Document[],
		user: User
	): Promise<Document[]>;
	abstract deleteDocuments(ids: DocumentId[], user: User): Promise<void>;
}
