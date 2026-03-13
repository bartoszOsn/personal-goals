import { Injectable } from '@nestjs/common';
import { SprintRepository } from '../../app/sprint/SprintRepository';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { User } from '../../domain/auth/model/User';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity } from './entity/SprintEntity';
import { In, Repository } from 'typeorm';
import { SprintEntityConverter } from './SprintEntityConverter';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { Sprint } from '../../domain/sprint/model/Sprint';

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

	async getSprintById(id: SprintId, user: User): Promise<Sprint | null> {
		const entity = await this.sprintRepository.findOneBy({
			user: { id: user.id.id },
			id: id.value
		});

		if (!entity) {
			return null;
		}

		const context = new ContextYear(entity.context);

		return (
			(await this.getSprintsByContext(context, user)).sprints.find(
				(sprint) => sprint.id.equals(id)
			) ?? null
		);
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
