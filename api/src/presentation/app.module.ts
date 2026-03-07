import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { TimePresentationModule } from './time/TimePresentationModule';
import { WorkPresentationModule } from './work/WorkPresentationModule';
import { WorkItemPresentationModule } from './work-item/WorkItemPresentationModule';

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
		WorkPresentationModule,
		WorkItemPresentationModule
	],
	controllers: []
})
export class AppModule {}
