import { DynamicModule, Module, Type } from '@nestjs/common';
import { TimeService } from './TimeService';
import { TimeDomainModule } from '../../domain/time/TimeDomainModule';

@Module({
	imports: [TimeDomainModule],
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
