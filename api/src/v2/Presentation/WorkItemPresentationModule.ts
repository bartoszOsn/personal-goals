import { Module } from '@nestjs/common';
import { WorkItemController } from './WorkItemController';
import { WorkItemAppModule } from '../app/WorkItemAppModule';
import { WorkItemInfrastructureModule } from '../inffrastructure/WorkItemInfrastructureModule';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { TimeAppModule } from '../../app/time/TimeAppModule';
import { TimeInfrastructureModule } from '../../infrastructure/time/TimeInfrastructureModule';

@Module({
	imports: [
		WorkItemAppModule.withRepositories(WorkItemInfrastructureModule),
		TimeAppModule.withRepositories(TimeInfrastructureModule)
	],
	controllers: [WorkItemController],
	providers: [WorkItemDTOConverter]
})
export class WorkItemPresentationModule {}
