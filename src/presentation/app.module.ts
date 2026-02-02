import { Module } from '@nestjs/common';
import { TimePresentationModule } from './time/TimePresentationModule';
import { AuthAppModule } from '../app/auth/AuthAppModule';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { AuthInfrastructureModule } from '../infrastructure/auth/AuthInfrastructureModule';
import { UserEntity } from '../infrastructure/auth/entity/UserEntity';
import { Repository } from 'typeorm';
import { WorkPresentationModule } from './work/WorkPresentationModule';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'database.sqlite',
			autoLoadEntities: true,
			synchronize: true // TODO: Remove in production, use migrations instead
		}),
		AuthAppModule, // TODO: remove when it will work
		AuthInfrastructureModule,
		TimePresentationModule,
		WorkPresentationModule
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
