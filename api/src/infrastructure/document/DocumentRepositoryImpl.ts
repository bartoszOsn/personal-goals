import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '../../app/document/DocumentRepository';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { Document } from '../../domain/document/model/Document';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentEntity } from './entity/DocumentEntity';
import { In, Repository } from 'typeorm';
import { DocumentEntityConverter } from './DocumentEntityConverter';
import { User } from '../../domain/auth/model/User';

@Injectable()
export class DocumentRepositoryImpl extends DocumentRepository {
	constructor(
		@InjectRepository(DocumentEntity)
		private readonly documentRepository: Repository<DocumentEntity>,
		private readonly documentEntityConverter: DocumentEntityConverter
	) {
		super();
	}

	async findByContext(context: ContextYear, user: User): Promise<Document[]> {
		const entities = await this.documentRepository.findBy({
			context: context.year,
			user: { id: user.id.id }
		});
		return this.documentEntityConverter.fromEntities(entities);
	}

	async findById(id: DocumentId, user: User): Promise<Document | null> {
		const entity = await this.documentRepository.findOneBy({
			id: id.id,
			user: { id: user.id.id }
		});
		return entity ? this.documentEntityConverter.fromEntity(entity) : null;
	}

	async saveDocuments(
		documents: Document[],
		user: User
	): Promise<Document[]> {
		const entities = this.documentEntityConverter.toEntities(
			documents,
			user
		);
		await this.documentRepository.save(entities);
		return this.documentEntityConverter.fromEntities(entities);
	}
	async deleteDocuments(ids: DocumentId[], user: User): Promise<void> {
		await this.documentRepository.delete({
			id: In(ids.map((id) => id.id)),
			user: { id: user.id.id }
		});
	}
}
