import { DynamicModule, Module, Type } from '@nestjs/common';
import { SprintService } from './SprintService';

@Module({
	providers: [SprintService],
	exports: [SprintService]
})
export class SprintAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: SprintAppModule,
			imports: [repositoryModule]
		};
	}
}
