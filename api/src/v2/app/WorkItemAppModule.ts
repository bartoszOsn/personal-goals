import { DynamicModule, Module, Type } from '@nestjs/common';
import { WorkItemCreationService } from './WorkItemCreationService';
import { WorkItemDeletionService } from './WorkItemDeletionService';
import { WorkItemUpdateService } from './WorkItemUpdateService';
import { WorkItemFacade } from './WorkItemFacade';

@Module({
	providers: [
		WorkItemCreationService,
		WorkItemDeletionService,
		WorkItemUpdateService,
		WorkItemFacade
	],
	exports: [WorkItemFacade]
})
export class WorkItemAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: WorkItemAppModule,
			imports: [repositoryModule]
		};
	}
}
