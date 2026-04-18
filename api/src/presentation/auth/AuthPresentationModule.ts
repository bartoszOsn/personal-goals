import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { AuthAppModule } from '../../app/auth/AuthAppModule';
import { AuthInfrastructureModule } from '../../infrastructure/auth/AuthInfrastructureModule';

@Module({
	imports: [AuthAppModule.withRepositories(AuthInfrastructureModule)],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		}
	]
})
export class AuthPresentationModule {}
