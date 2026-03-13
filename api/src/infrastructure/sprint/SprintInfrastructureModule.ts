import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SprintEntity } from './entity/SprintEntity';
import { SprintRepository } from '../../app/sprint/SprintRepository';
import { SprintRepositoryImpl } from './SprintRepositoryImpl';
import { SprintEntityConverter } from './SprintEntityConverter';

@Module({
	imports: [TypeOrmModule.forFeature([SprintEntity])],
	providers: [
		{ provide: SprintRepository, useClass: SprintRepositoryImpl },
		SprintEntityConverter
	],
	exports: [SprintRepository]
})
export class SprintInfrastructureModule {}
