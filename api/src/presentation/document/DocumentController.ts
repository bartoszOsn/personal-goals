import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseArrayPipe,
	ParseIntPipe,
	Post,
	Put,
	UseFilters
} from '@nestjs/common';
import {
	DocumentDetailsDTO,
	DocumentDTO,
	DocumentsRequestDTO
} from '@personal-okr/shared';
import { DocumentService } from '../../app/document/DocumentService';
import { DocumentDTOConverter } from './DocumentDTOConverter';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { DocumentId } from '../../domain/document/model/DocumentId';
import { DocumentDomainErrorExceptionFilter } from './DocumentDomainErrorExceptionFilter';

@Controller('document')
@UseFilters(DocumentDomainErrorExceptionFilter)
export class DocumentController {
	constructor(
		private readonly documentService: DocumentService,
		private readonly documentDTOConverter: DocumentDTOConverter
	) {}

	@Get('/:context')
	async getDocuments(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<DocumentDTO[]> {
		const context = new ContextYear(contextRaw);
		const documents =
			await this.documentService.getDocumentsByContext(context);
		return this.documentDTOConverter.toDocumentsDTO(documents);
	}

	@Get('/details/:id')
	async getDocumentDetails(
		@Param('id') idRaw: string
	): Promise<DocumentDetailsDTO> {
		const id = new DocumentId(idRaw);
		const document = await this.documentService.getDocumentById(id);
		return this.documentDTOConverter.toDocumentDetailsDTO(document);
	}

	@Post('/:context')
	async createDocument(
		@Param('context', new ParseIntPipe()) contextRaw: number
	): Promise<DocumentDTO[]> {
		const context = new ContextYear(contextRaw);
		const documents = await this.documentService.createDocument(context);
		return this.documentDTOConverter.toDocumentsDTO(documents);
	}

	@Put('/:context')
	async updateDocuments(
		@Param('context', new ParseIntPipe()) contextRaw: number,
		@Body() body: DocumentsRequestDTO
	): Promise<DocumentDTO[]> {
		const context = new ContextYear(contextRaw);
		const requests =
			this.documentDTOConverter.fromDocumentsRequestDTO(body);
		const documents = await this.documentService.updateDocuments(
			context,
			requests
		);
		return this.documentDTOConverter.toDocumentsDTO(documents);
	}

	@Delete('/:context/:ids')
	async deleteDocuments(
		@Param('context', new ParseIntPipe()) contextRaw: number,
		@Param('ids', new ParseArrayPipe({ separator: ',' })) idsRaw: string[]
	): Promise<DocumentDTO[]> {
		const context = new ContextYear(contextRaw);
		const ids = idsRaw.map((id) => new DocumentId(id));
		const documents = await this.documentService.deleteDocuments(
			context,
			ids
		);
		return this.documentDTOConverter.toDocumentsDTO(documents);
	}
}
