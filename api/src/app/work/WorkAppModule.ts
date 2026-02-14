import { DynamicModule, Module, Type } from '@nestjs/common';
import { WorkOKRService } from './WorkOKRService';
import { TaskService } from './TaskService';

@Module({
	providers: [WorkOKRService, TaskService],
	exports: [WorkOKRService, TaskService]
})
export class WorkAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: WorkAppModule,
			imports: [repositoryModule]
		};
	}
}
