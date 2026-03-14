import { Module } from '@nestjs/common';
import { DocumentRepository } from '../../app/document/DocumentRepository';
import { DocumentRepositoryImpl } from './DocumentRepositoryImpl';
import { DocumentEntityConverter } from './DocumentEntityConverter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentEntity } from './entity/DocumentEntity';

@Module({
	imports: [TypeOrmModule.forFeature([DocumentEntity])],
	providers: [
		{ provide: DocumentRepository, useClass: DocumentRepositoryImpl },
		DocumentEntityConverter
	],
	exports: [DocumentRepository]
})
export class DocumentInfrastructureModule {}
