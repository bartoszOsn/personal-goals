import { Module } from '@nestjs/common';
import { TimeService } from './TimeService';

@Module({
	providers: [TimeService],
	exports: [TimeService]
})
export class TimeAppModule {}
