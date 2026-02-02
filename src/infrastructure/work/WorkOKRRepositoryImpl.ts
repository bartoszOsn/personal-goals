import { Injectable } from '@nestjs/common';
import { WorkOKRRepository } from '../../app/work/WorkOKRRepository';
import { User } from 'src/domain/auth/model/User';
import { KeyResult, KeyResultId } from 'src/domain/work/model/KeyResult';
import { KeyResultRequest } from 'src/domain/work/model/KeyResultRequest';
import { Objective, ObjectiveId } from 'src/domain/work/model/Objective';
import { ObjectiveRequest } from 'src/domain/work/model/ObjectiveRequest';

@Injectable()
export class WorkOKRRepositoryImpl extends WorkOKRRepository {
	getObjectives(user: User): Promise<Objective[]> {
		throw new Error('Method not implemented.');
	}
	createObjective(user: User, request: ObjectiveRequest): Promise<Objective> {
		throw new Error('Method not implemented.');
	}
	updateObjective(
		user: User,
		id: ObjectiveId,
		request: ObjectiveRequest
	): Promise<Objective> {
		throw new Error('Method not implemented.');
	}
	deleteObjective(user: User, id: ObjectiveId): Promise<void> {
		throw new Error('Method not implemented.');
	}
	createKeyResult(
		user: User,
		parentId: ObjectiveId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		throw new Error('Method not implemented.');
	}
	updateKeyResult(
		user: User,
		id: KeyResultId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		throw new Error('Method not implemented.');
	}
	deleteKeyResult(user: User, id: KeyResultId): Promise<void> {
		throw new Error('Method not implemented.');
	}
}