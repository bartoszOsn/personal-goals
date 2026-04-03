import { DynamicModule, Module, Type } from '@nestjs/common';
import { WorkItemService } from './WorkItemService';

@Module({
	providers: [WorkItemService],
	exports: [WorkItemService]
})
export class WorkItemAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: WorkItemAppModule,
			imports: [repositoryModule]
		};
	}
}
