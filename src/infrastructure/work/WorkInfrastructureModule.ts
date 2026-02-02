import { Module } from '@nestjs/common';
import { WorkOKRRepositoryImpl } from './WorkOKRRepositoryImpl';
import { WorkOKRRepository } from '../../app/work/WorkOKRRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectiveEntity } from './entity/ObjectiveEntity';
import { KeyResultEntity } from './entity/KeyResultEntity';
import { WorkOKREntityConverter } from './WorkOKREntityConverter';

@Module({
	imports: [TypeOrmModule.forFeature([ObjectiveEntity, KeyResultEntity])],
	providers: [
		{ provide: WorkOKRRepository, useClass: WorkOKRRepositoryImpl },
		WorkOKREntityConverter
	],
	exports: [WorkOKRRepository]
})
export class WorkInfrastructureModule {}
