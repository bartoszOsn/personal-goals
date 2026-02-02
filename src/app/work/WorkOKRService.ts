import { Injectable, NotImplementedException } from '@nestjs/common';
import { Objective, ObjectiveId } from '../../domain/work/model/Objective';
import { ObjectiveRequest } from '../../domain/work/model/ObjectiveRequest';
import { KeyResult, KeyResultId } from '../../domain/work/model/KeyResult';
import { KeyResultRequest } from '../../domain/work/model/KeyResultRequest';

@Injectable()
export class WorkOKRService {
	getObjectives(): Promise<Objective[]> {
		throw new NotImplementedException();
	}

	createObjective(request: ObjectiveRequest): Promise<Objective> {
		throw new NotImplementedException();
	}

	updateObjective(
		id: ObjectiveId,
		request: ObjectiveRequest
	): Promise<Objective> {
		throw new NotImplementedException();
	}

	deleteObjective(id: ObjectiveId): Promise<void> {
		throw new NotImplementedException();
	}

	createKeyResult(
		parentId: ObjectiveId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		throw new NotImplementedException();
	}

	async updateKeyResult(
		id: KeyResultId,
		request: KeyResultRequest
	): Promise<KeyResult> {
		throw new NotImplementedException();
	}

	async deleteKeyResult(id: KeyResultId): Promise<void> {
		throw new NotImplementedException();
	}
}
