import { Module } from '@nestjs/common';
import { WorkItemRepository } from '../../app/work-item-v2/WorkItemRepository';
import { WorkItemRepositoryImpl } from './WorkItemRepositoryImpl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintAppModule } from '../../app/sprint/SprintAppModule';
import { SprintInfrastructureModule } from '../sprint/SprintInfrastructureModule';

@Module({
	imports: [
		TypeOrmModule.forFeature([]),
		SprintAppModule.withRepositories(SprintInfrastructureModule)
	],
	providers: [
		{ provide: WorkItemRepository, useClass: WorkItemRepositoryImpl }
	],
	exports: [WorkItemRepository]
})
export class WorkItemInfrastructureModule {}
