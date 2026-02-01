import { Module } from '@nestjs/common';
import { TimePresentationModule } from './time/TimePresentationModule';
import { AuthAppModule } from '../app/auth/AuthAppModule';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AuthInfrastructureModule } from '../infrastructure/auth/AuthInfrastructureModule';
import { UserEntity } from '../infrastructure/auth/entity/UserEntity';
import { Repository } from 'typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'database.sqlite',
			autoLoadEntities: true,
			synchronize: true // TODO: Remove in production, use migrations instead
		}),
		AuthAppModule,
		AuthInfrastructureModule,
		TimePresentationModule
	],
	controllers: []
})
export class AppModule {
	constructor(
		@InjectRepository(UserEntity)
		userRepository: Repository<UserEntity>
	) {
		const defaultUser = new UserEntity();
		defaultUser.id = 'mock-user';
		userRepository.save(defaultUser).catch((error) => console.log(error));
	}
}
