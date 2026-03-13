import { Injectable } from '@nestjs/common';
import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { SprintRepository } from './SprintRepository';
import { SprintFactory } from '../../domain/sprint/factory/SprintFactory';
import { SprintUpdateRequest } from '../../domain/sprint/model/SprintUpdateRequest';
import { SprintId } from '../../domain/sprint/model/SprintId';

@Injectable()
export class SprintService {
	constructor(private readonly sprintRepository: SprintRepository) {}

	getSprintsByContext(
		context: ContextYear
	): Promise<SprintContextCollection> {
		return this.sprintRepository.getSprintsByContext(context);
	}

	async createSprint(context: ContextYear): Promise<SprintContextCollection> {
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.createSprint()
			.build();

		await this.sprintRepository.save(newSprintCollection);
		return newSprintCollection;
	}

	async fillSprints(context: ContextYear): Promise<SprintContextCollection> {
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.fill()
			.build();

		await this.sprintRepository.save(newSprintCollection);
		return newSprintCollection;
	}

	async updateSprints(
		context: ContextYear,
		requests: SprintUpdateRequest[]
	): Promise<SprintContextCollection> {
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.updateMany(requests)
			.build();

		await this.sprintRepository.save(newSprintCollection);
		return newSprintCollection;
	}

	async deleteSprints(
		context: ContextYear,
		ids: SprintId[]
	): Promise<SprintContextCollection> {
		const oldSprintCollection =
			await this.sprintRepository.getSprintsByContext(context);
		const newSprintCollection = SprintFactory.from(oldSprintCollection)
			.deleteMany(ids)
			.build();

		await this.sprintRepository.save(newSprintCollection);
		return newSprintCollection;
	}
}
