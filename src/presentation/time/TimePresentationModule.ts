import { Module } from '@nestjs/common';
import { TimeController } from './TimeController';
import { TimeAppModule } from '../../app/time/TimeAppModule';
import { TimeDTOConverter } from './TimeDTOConverter';

@Module({
	imports: [TimeAppModule],
	controllers: [TimeController],
	providers: [TimeDTOConverter]
})
export class TimePresentationModule {}
