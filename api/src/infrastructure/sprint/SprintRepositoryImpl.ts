import { Injectable } from '@nestjs/common';
import { SprintRepository } from '../../app/sprint/SprintRepository';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { User } from '../../domain/auth/model/User';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity } from './entity/SprintEntity';
import { In, Repository } from 'typeorm';
import { SprintEntityConverter } from './SprintEntityConverter';

@Injectable()
export class SprintRepositoryImpl extends SprintRepository {
	constructor(
		@InjectRepository(SprintEntity)
		private readonly sprintRepository: Repository<SprintEntity>,
		private readonly sprintEntityConverter: SprintEntityConverter
	) {
		super();
	}

	async getSprintsByContext(
		context: ContextYear,
		user: User
	): Promise<SprintContextCollection> {
		const entities = await this.sprintRepository.findBy({
			user: { id: user.id.id },
			context: context.year
		});

		return this.sprintEntityConverter.fromEntities(context, entities);
	}

	async save(
		sprintCollection: SprintContextCollection,
		user: User
	): Promise<void> {
		const old = await this.getSprintsByContext(
			sprintCollection.context,
			user
		);
		const sprintsToDelete = old.sprints.filter(
			(sprint) =>
				!sprintCollection.sprints.some((newS) =>
					newS.id.equals(sprint.id)
				)
		);
		if (sprintsToDelete.length > 0) {
			await this.sprintRepository.delete({
				id: In(sprintsToDelete.map((sprint) => sprint.id.value))
			});
		}

		const entitiesToSave = this.sprintEntityConverter.toEntities(
			sprintCollection,
			user
		);
		await this.sprintRepository.save(entitiesToSave);
	}
}
