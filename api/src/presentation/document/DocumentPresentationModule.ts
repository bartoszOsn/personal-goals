import { Module } from '@nestjs/common';
import { DocumentController } from './DocumentController';
import { DocumentAppModule } from '../../app/document/DocumentAppModule';
import { DocumentInfrastructureModule } from '../../infrastructure/document/DocumentInfrastructureModule';
import { DocumentDTOConverter } from './DocumentDTOConverter';

@Module({
	imports: [DocumentAppModule.withRepositories(DocumentInfrastructureModule)],
	providers: [DocumentDTOConverter],
	controllers: [DocumentController]
})
export class DocumentPresentationModule {}
