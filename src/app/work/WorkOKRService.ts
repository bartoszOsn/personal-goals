import { Injectable } from '@nestjs/common';
import { Objective, ObjectiveId } from '../../domain/work/model/Objective';
import { ObjectiveRequest } from '../../domain/work/model/ObjectiveRequest';
import { KeyResult, KeyResultId } from '../../domain/work/model/KeyResult';
import { KeyResultRequest } from '../../domain/work/model/KeyResultRequest';
import { WorkOKRRepository } from './WorkOKRRepository';
import { UserStorage } from '../auth/UserStorage';

@Injectable()
export class WorkOKRService {
	constructor(
		private readonly workOKRRepository: WorkOKRRepository,
		private readonly userStorage: UserStorage
	) {}

	async getObjectives(): Promise<Objective[]> {
		const user = await this.userStorage.getUser();
		return this.workOKRRepository.getObjectives(user);
	}

	async createObjective(request: ObjectiveRequest): Promise<Objective> {
		const user = await this.userStorage.getUser();
		return this.workOKRRepository.createObjective(user, request);
	}

	async updateObjective(
		id: ObjectiveId,
		request: ObjectiveRequest
	): Promise<Objective> {
		const user = await this.userStorage.getUser();
		return this.workOKRRepository.updateObjective(user, id, request);
	}

	async deleteObjective(id: ObjectiveId): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.workOKRRepository.deleteObjective(user, id);
	}

	async createKeyResult(
		parentId: ObjectiveId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		const user = await this.userStorage.getUser();
		return this.workOKRRepository.createKeyResult(user, parentId, request);
	}

	async updateKeyResult(
		id: KeyResultId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		const user = await this.userStorage.getUser();
		return this.workOKRRepository.updateKeyResult(user, id, request);
	}

	async deleteKeyResult(id: KeyResultId): Promise<void> {
		const user = await this.userStorage.getUser();
		await this.workOKRRepository.deleteKeyResult(user, id);
	}
}
