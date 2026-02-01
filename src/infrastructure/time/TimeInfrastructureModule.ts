import { Module } from '@nestjs/common';
import { TimeRepositoryImpl } from './TimeRepositoryImpl';
import { TimeRepository } from '../../app/time/TimeRepository';

@Module({
	providers: [{ provide: TimeRepository, useClass: TimeRepositoryImpl }],
	exports: [TimeRepository]
})
export class TimeInfrastructureModule {}
