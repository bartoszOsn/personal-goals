import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { AuthAppModule } from '../../app/auth/AuthAppModule';
import { AuthInfrastructureModule } from '../../infrastructure/auth/AuthInfrastructureModule';

@Module({
	imports: [
		PassportModule,
		AuthAppModule.withRepositories(AuthInfrastructureModule)
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		}
	]
})
export class AuthPresentationModule {}
