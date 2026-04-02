import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { WorkItemPresentationModule } from './work-item/WorkItemPresentationModule';
import { SprintPresentationModule } from './sprint/SprintPresentationModule';
import { DocumentPresentationModule } from './document/DocumentPresentationModule';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './GlobalExceptionFilter';
import { WorkItemPresentationModuleV2 } from './work-item-v2/WorkItemPresentationModuleV2';

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
		WorkItemPresentationModuleV2,
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
