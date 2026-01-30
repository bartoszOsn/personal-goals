import { Module } from '@nestjs/common';
import { TimeController } from './TimeController';

@Module({
	imports: [],
	controllers: [TimeController],
	providers: []
})
export class TimePresentationModule {}
