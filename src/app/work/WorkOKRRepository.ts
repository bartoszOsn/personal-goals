import { Objective, ObjectiveId } from '../../domain/work/model/Objective';
import { User } from '../../domain/auth/model/User';
import { ObjectiveRequest } from '../../domain/work/model/ObjectiveRequest';
import { KeyResultRequest } from '../../domain/work/model/KeyResultRequest';
import { KeyResult, KeyResultId } from '../../domain/work/model/KeyResult';

export abstract class WorkOKRRepository {
	abstract getObjectives(user: User): Promise<Objective[]>;
	abstract createObjective(
		user: User,
		request: ObjectiveRequest
	): Promise<Objective>;
	abstract updateObjective(
		user: User,
		id: ObjectiveId,
		request: ObjectiveRequest
	): Promise<Objective>;
	abstract deleteObjective(user: User, id: ObjectiveId): Promise<void>;

	abstract createKeyResult(
		user: User,
		parentId: ObjectiveId,
		request: KeyResultRequest
	): Promise<KeyResult>;

	abstract updateKeyResult(
		user: User,
		id: KeyResultId,
		request: KeyResultRequest
	): Promise<KeyResult>;

	abstract deleteKeyResult(user: User, id: KeyResultId): Promise<void>;
}
