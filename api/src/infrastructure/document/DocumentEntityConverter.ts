import { Injectable } from '@nestjs/common';
import { DocumentEntity } from './entity/DocumentEntity';
import { Document } from '../../domain/document/model/Document';
import { User } from '../../domain/auth/model/User';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { DocumentTitle } from '../../domain/document/model/DocumentTitle';
import { DocumentDescription } from '../../domain/document/model/DocumentDescription';
import { Temporal } from 'temporal-polyfill';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentEntityConverter {
	constructor(
		@InjectRepository(DocumentEntity)
		private readonly documentRepository: Repository<DocumentEntity>
	) {}

	fromEntities(entities: DocumentEntity[]): Document[] {
		return entities.map((entity) => this.fromEntity(entity));
	}
	fromEntity(entity: DocumentEntity): Document {
		return new Document(
			new DocumentId(entity.id),
			new ContextYear(entity.context),
			new DocumentTitle(entity.title),
			new DocumentDescription(entity.description),
			Temporal.PlainDateTime.from(entity.updatedAt)
		);
	}

	toEntities(documents: Document[], user: User): DocumentEntity[] {
		return documents.map((document) =>
			this.documentRepository.create({
				id: document.id.id,
				context: document.context.year,
				title: document.title.title,
				description: document.description.description,
				updatedAt: document.editedAt.toString(),
				user: { id: user.id.id }
			})
		);
	}
}
