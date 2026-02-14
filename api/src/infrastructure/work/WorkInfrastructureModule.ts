import { Module } from '@nestjs/common';
import { WorkOKRRepositoryImpl } from './WorkOKRRepositoryImpl';
import { WorkOKRRepository } from '../../app/work/WorkOKRRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectiveEntity } from './entity/ObjectiveEntity';
import { KeyResultEntity } from './entity/KeyResultEntity';
import { WorkOKREntityConverter } from './WorkOKREntityConverter';
import { TaskEntity } from './entity/TaskEntity';
import { TaskRepository } from '../../app/work/TaskRepository';
import { TaskRepositoryImpl } from './TaskRepositoryImpl';
import { TaskEntityConverter } from './TaskEntityConverter';

@Module({
	imports: [
		TypeOrmModule.forFeature([ObjectiveEntity, KeyResultEntity, TaskEntity])
	],
	providers: [
		{ provide: WorkOKRRepository, useClass: WorkOKRRepositoryImpl },
		WorkOKREntityConverter,
		{ provide: TaskRepository, useClass: TaskRepositoryImpl },
		TaskEntityConverter
	],
	exports: [WorkOKRRepository, TaskRepository]
})
export class WorkInfrastructureModule {}
