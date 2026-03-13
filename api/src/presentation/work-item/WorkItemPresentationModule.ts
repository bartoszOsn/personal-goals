import { Module } from '@nestjs/common';
import { WorkItemController } from './WorkItemController';
import { WorkItemAppModule } from '../../app/work-item/WorkItemAppModule';
import { WorkItemInfrastructureModule } from '../../infrastructure/work-item/WorkItemInfrastructureModule';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../../infrastructure/sprint/SprintInfrastructureModule';

@Module({
	imports: [
		WorkItemAppModule.withRepositories(WorkItemInfrastructureModule),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	controllers: [WorkItemController],
	providers: [WorkItemDTOConverter]
})
export class WorkItemPresentationModule {}
