import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { SprintPresentationModule } from './sprint/SprintPresentationModule';
import { DocumentPresentationModule } from './document/DocumentPresentationModule';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './GlobalExceptionFilter';
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
		WorkItemPresentationModule,
		SprintPresentationModule,
		DocumentPresentationModule
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter
		}
	]
})
export class AppModule {}
