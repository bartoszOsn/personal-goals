import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { WorkItemPresentationModule } from './work-item/WorkItemPresentationModule';
import { SprintPresentationModule } from './sprint/SprintPresentationModule';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'database.sqlite',
			autoLoadEntities: true,
			synchronize: true // TODO: Remove in production, use migrations instead
		}),
		AuthPresentationModule,
		WorkItemPresentationModule,
		SprintPresentationModule
	],
	controllers: []
})
export class AppModule {}
