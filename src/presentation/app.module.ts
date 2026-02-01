import { Module } from '@nestjs/common';
import { TimePresentationModule } from './time/TimePresentationModule';
import { AuthAppModule } from '../app/auth/AuthAppModule';

@Module({
	imports: [AuthAppModule, TimePresentationModule],
	controllers: []
})
export class AppModule {}
