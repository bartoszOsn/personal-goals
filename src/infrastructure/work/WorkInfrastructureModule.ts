import { Module } from '@nestjs/common';
import { WorkOKRRepositoryImpl } from './WorkOKRRepositoryImpl';
import { WorkOKRRepository } from '../../app/work/WorkOKRRepository';

@Module({
	providers: [
		{ provide: WorkOKRRepository, useClass: WorkOKRRepositoryImpl }
	],
	exports: [WorkOKRRepository]
})
export class WorkInfrastructureModule {}
