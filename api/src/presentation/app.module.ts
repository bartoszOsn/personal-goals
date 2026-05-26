import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { SprintPresentationModule } from './sprint/SprintPresentationModule';
import { DocumentPresentationModule } from './document/DocumentPresentationModule';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './GlobalExceptionFilter';
import { WorkItemPresentationModule } from './work-item/WorkItemPresentationModule';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

const dbOptions: TypeOrmModuleOptions = process.env['PSQL_URL']
	? {
			type: 'postgres',
			url: process.env['PSQL_URL'],
			autoLoadEntities: true
		}
	: {
			type: 'sqlite',
			database: 'database.sqlite',
			autoLoadEntities: true
		};

@Module({
	imports: [
		TypeOrmModule.forRoot(dbOptions),
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
