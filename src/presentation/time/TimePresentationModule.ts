import { Module } from '@nestjs/common';
import { TimeController } from './TimeController';
import { TimeAppModule } from '../../app/time/TimeAppModule';
import { TimeDTOConverter } from './TimeDTOConverter';
import { TimeInfrastructureModule } from '../../infrastructure/time/TimeInfrastructureModule';

@Module({
	imports: [TimeAppModule.withRepositories(TimeInfrastructureModule)],
	controllers: [TimeController],
	providers: [TimeDTOConverter]
})
export class TimePresentationModule {}
