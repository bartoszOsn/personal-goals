import { Module } from '@nestjs/common';
import { TimeRepositoryImpl } from './TimeRepositoryImpl';
import { TimeRepository } from '../../app/time/TimeRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';
import { TimeEntityConverter } from './TimeEntityConverter';
import { RestPeriodEntity } from './entity/RestPeriodEntity';

@Module({
	imports: [
		TypeOrmModule.forFeature([SprintSettingsEntity, RestPeriodEntity])
	],
	providers: [
		{ provide: TimeRepository, useClass: TimeRepositoryImpl },
		TimeEntityConverter
	],
	exports: [TimeRepository]
})
export class TimeInfrastructureModule {}
