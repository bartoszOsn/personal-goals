import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { TimePresentationModule } from './time/TimePresentationModule';
import { WorkPresentationModule } from './work/WorkPresentationModule';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'database.sqlite',
			autoLoadEntities: true,
			synchronize: true // TODO: Remove in production, use migrations instead
		}),
		AuthPresentationModule,
		TimePresentationModule,
		WorkPresentationModule
	],
	controllers: []
})
export class AppModule {}
