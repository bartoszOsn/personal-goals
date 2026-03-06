import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthPresentationModule } from './auth/AuthPresentationModule';
import { TimePresentationModule } from './time/TimePresentationModule';
import { WorkPresentationModule } from './work/WorkPresentationModule';
import { PresentationModuleV2 } from '../v2/Presentation/WorkPresentationModuleV2';

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
		PresentationModuleV2
	],
	controllers: []
})
export class AppModule {}
