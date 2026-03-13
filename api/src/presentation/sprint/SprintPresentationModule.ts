import { Module } from '@nestjs/common';
import { SprintController } from './SprintController';
import { SprintDTOConverter } from './SprintDTOConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../../infrastructure/sprint/SprintInfrastructureModule';

@Module({
	imports: [SprintAppModule.withRepositories(SprintInfrastructureModule)],
	providers: [SprintDTOConverter],
	controllers: [SprintController]
})
export class SprintPresentationModule {}
