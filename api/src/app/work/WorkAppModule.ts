import { DynamicModule, Module, Type } from '@nestjs/common';
import { WorkOKRService } from './WorkOKRService';

@Module({
	providers: [WorkOKRService],
	exports: [WorkOKRService]
})
export class WorkAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: WorkAppModule,
			imports: [repositoryModule]
		};
	}
}
