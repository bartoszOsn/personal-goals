import { Module } from '@nestjs/common';
import { TimePresentationModule } from './time/TimePresentationModule';

@Module({
	imports: [TimePresentationModule],
	controllers: [],
	providers: []
})
export class AppModule {}
