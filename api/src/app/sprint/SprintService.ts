import { Injectable } from '@nestjs/common';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { SprintRepository } from './SprintRepository';
import { SprintFactory } from '../../domain/sprint/factory/SprintFactory';
import { SprintUpdateRequest } from '../../domain/sprint/model/SprintUpdateRequest';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { UserStorage } from '../auth/UserStorage';
import { Sprint } from '../../domain/sprint/model/Sprint';

@Injectable()
export class SprintService {
	constructor(
		private readonly sprintRepository: SprintRepository,
		private readonly userStorage: UserStorage
	) {}

	async getSprintsByContext(
		context: ContextYear
	): Promise<SprintContextCollection> {
		const user = await this.userStorage.getUser();
		return this.sprintRepository.getSprintsByContext(context, user);
	}

	async getSprintById(id: SprintId): Promise<Sprint | null> {
		const user = await this.userStorage.getUser();
		return this.sprintRepository.getSprintById(id, user);
	}

	async createSprint(context: ContextYear): Promise<SprintContextCollection> {
		const user = await this.userStorage.getUser();
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context, user);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.createSprint()
			.build();

		await this.sprintRepository.save(newSprintCollection, user);
		return newSprintCollection;
	}

	async fillSprints(context: ContextYear): Promise<SprintContextCollection> {
		const user = await this.userStorage.getUser();
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context, user);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.fill()
			.build();

		await this.sprintRepository.save(newSprintCollection, user);
		return newSprintCollection;
	}

	async updateSprints(
		context: ContextYear,
		requests: SprintUpdateRequest[]
	): Promise<SprintContextCollection> {
		const user = await this.userStorage.getUser();
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context, user);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.updateMany(requests)
			.build();

		await this.sprintRepository.save(newSprintCollection, user);
		return newSprintCollection;
	}

	async deleteSprints(
		context: ContextYear,
		ids: SprintId[]
	): Promise<SprintContextCollection> {
		const user = await this.userStorage.getUser();
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context, user);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.deleteMany(ids)
			.build();

		await this.sprintRepository.save(newSprintCollection, user);
		return newSprintCollection;
	}
}
