import { Module } from '@nestjs/common';
import { WorkPresentationOKRController } from './WorkPresentationOKRController';
import { WorkAppModule } from '../../app/work/WorkAppModule';
import { WorkInfrastructureModule } from '../../infrastructure/work/WorkInfrastructureModule';
import { WorkOkrDTOConverter } from './WorkOkrDTOConverter';
import { TaskController } from './TaskController';
import { TaskDTOConverter } from './TaskDTOConverter';

@Module({
	imports: [WorkAppModule.withRepositories(WorkInfrastructureModule)],
	providers: [WorkOkrDTOConverter, TaskDTOConverter],
	controllers: [WorkPresentationOKRController, TaskController]
})
export class WorkPresentationModule {}
