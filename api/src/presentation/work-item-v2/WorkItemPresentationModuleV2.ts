import { Module } from '@nestjs/common';
import { WorkItemAppModule } from '../../app/work-item/WorkItemAppModule';
import { WorkItemInfrastructureModule } from '../../infrastructure/work-item/WorkItemInfrastructureModule';
import { WorkItemDTOConverter } from './WorkItemDTOConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../../infrastructure/sprint/SprintInfrastructureModule';
import { WorkItemControllerV2 } from './WorkItemControllerV2';

@Module({
	imports: [
		WorkItemAppModule.withRepositories(WorkItemInfrastructureModule),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	controllers: [WorkItemControllerV2],
	providers: [WorkItemDTOConverter]
})
export class WorkItemPresentationModuleV2 {}
