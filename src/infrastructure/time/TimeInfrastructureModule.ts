import { Module } from '@nestjs/common';
import { TimeRepositoryImpl } from './TimeRepositoryImpl';
import { TimeRepository } from '../../app/time/TimeRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintSettingsEntity } from './entity/SprintSettingsEntity';

@Module({
	imports: [TypeOrmModule.forFeature([SprintSettingsEntity])],
	providers: [{ provide: TimeRepository, useClass: TimeRepositoryImpl }],
	exports: [TimeRepository]
})
export class TimeInfrastructureModule {}
