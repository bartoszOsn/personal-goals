import { DynamicModule, Module, Type } from '@nestjs/common';
import { DocumentService } from './DocumentService';

@Module({
	providers: [DocumentService],
	exports: [DocumentService]
})
export class DocumentAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: DocumentAppModule,
			imports: [repositoryModule]
		};
	}
}
