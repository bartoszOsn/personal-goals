import { Module } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { WorkItemRepositoryImpl } from './WorkItemRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkItemEntityOld } from './entity/WorkItemEntityOld';
import { WorkItemEntityConverter } from './WorkItemEntityConverter';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../sprint/SprintInfrastructureModule';

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkItemEntityOld]),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	providers: [
		{ provide: WorkItemRepository, useClass: WorkItemRepositoryImpl },
		WorkItemEntityConverter
	],
	exports: [WorkItemRepository]
})
export class WorkItemInfrastructureModule {}
