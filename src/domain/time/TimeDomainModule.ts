import { Module } from '@nestjs/common';
import { TimeSprintCalculationService } from './TimeSprintCalculationService';

@Module({
	providers: [TimeSprintCalculationService],
	exports: [TimeSprintCalculationService]
})
export class TimeDomainModule {}
