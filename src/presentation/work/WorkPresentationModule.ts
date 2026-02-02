import { Module } from '@nestjs/common';
import { WorkPresentationOKRController } from './WorkPresentationOKRController';
import { WorkAppModule } from '../../app/work/WorkAppModule';
import { WorkInfrastructureModule } from '../../infrastructure/work/WorkInfrastructureModule';

@Module({
	imports: [WorkAppModule.withRepositories(WorkInfrastructureModule)],
	controllers: [WorkPresentationOKRController]
})
export class WorkPresentationModule {}
