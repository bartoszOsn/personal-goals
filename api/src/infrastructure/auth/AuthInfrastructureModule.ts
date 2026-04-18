import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/UserEntity';
import { AuthRepository } from '../../app/auth/AuthRepository';
import { AuthRepositoryImpl } from './AuthRepositoryImpl';
import { FirebaseAuthRepository } from './FirebaseAuthRepository';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [
		{ provide: AuthRepository, useClass: AuthRepositoryImpl },
		FirebaseAuthRepository
	],
	exports: [TypeOrmModule, AuthRepository]
})
export class AuthInfrastructureModule {}
