import { Module } from '@nestjs/common';
import { WorkItemInfrastructureModule } from '../../infrastructure/work-item-v2/WorkItemInfrastructureModule';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../../infrastructure/sprint/SprintInfrastructureModule';
import { WorkItemControllerV2 } from './WorkItemControllerV2';
import { WorkItemAppModule } from '../../app/work-item-v2/WorkItemAppModule';

@Module({
	imports: [
		WorkItemAppModule.withRepositories(WorkItemInfrastructureModule),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	controllers: [WorkItemControllerV2],
	providers: [WorkItemDTOConverter]
})
export class WorkItemPresentationModuleV2 {}
