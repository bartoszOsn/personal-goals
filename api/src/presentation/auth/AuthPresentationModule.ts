import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './AuthController';
import { JwtStrategy } from './strategies/JwtStrategy';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { AuthAppModule } from '../../app/auth/AuthAppModule';
import { AuthInfrastructureModule } from '../../infrastructure/auth/AuthInfrastructureModule';

@Module({
	imports: [
		PassportModule,
		AuthAppModule.withRepositories(AuthInfrastructureModule)
	],
	controllers: [AuthController],
	providers: [
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard
		}
	]
})
export class AuthPresentationModule {}
