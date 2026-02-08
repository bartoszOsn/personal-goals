import { DynamicModule, Module, Type } from '@nestjs/common';
import { TimeService } from './TimeService';

@Module({
	providers: [TimeService],
	exports: [TimeService]
})
export class TimeAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: TimeAppModule,
			imports: [repositoryModule]
		};
	}
}
