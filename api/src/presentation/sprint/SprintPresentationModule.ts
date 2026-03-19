import { Module } from '@nestjs/common';
import { SprintController } from './SprintController';
import { SprintDTOConverter } from './SprintDTOConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../../infrastructure/sprint/SprintInfrastructureModule';
import { APP_FILTER } from '@nestjs/core';
import { SprintDomainErrorExceptionFillter } from './SprintDomainErrorExceptionFillter';

@Module({
	imports: [SprintAppModule.withRepositories(SprintInfrastructureModule)],
	providers: [
		SprintDTOConverter,
		{
			provide: APP_FILTER,
			useClass: SprintDomainErrorExceptionFillter
		}
	],
	controllers: [SprintController]
})
export class SprintPresentationModule {}
