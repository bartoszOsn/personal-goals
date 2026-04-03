import { Module } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item/WorkItemRepository';
import { WorkItemRepositoryImpl } from './WorkItemRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../sprint/SprintInfrastructureModule';
import { WorkItemEntity } from './entity/WorkItemEntity';
import { WorkItemEntityConverter } from './WorkItemEntityConverter';

@Module({
	imports: [
		TypeOrmModule.forFeature([WorkItemEntity]),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	providers: [
		{ provide: WorkItemRepository, useClass: WorkItemRepositoryImpl },
		WorkItemEntityConverter
	],
	exports: [WorkItemRepository]
})
export class WorkItemInfrastructureModule {}
