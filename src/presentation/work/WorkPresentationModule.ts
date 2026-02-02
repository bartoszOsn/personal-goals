import { Module } from '@nestjs/common';
import { WorkPresentationOKRController } from './WorkPresentationOKRController';
import { WorkAppModule } from '../../app/work/WorkAppModule';
import { WorkInfrastructureModule } from '../../infrastructure/work/WorkInfrastructureModule';
import { WorkOkrDTOConverter } from './WorkOkrDTOConverter';

@Module({
	imports: [WorkAppModule.withRepositories(WorkInfrastructureModule)],
	providers: [WorkOkrDTOConverter],
	controllers: [WorkPresentationOKRController]
})
export class WorkPresentationModule {}
