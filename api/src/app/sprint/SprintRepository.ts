import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { User } from '../../domain/auth/model/User';

export abstract class SprintRepository {
	abstract getSprintsByContext(
		context: ContextYear,
		user: User
	): Promise<SprintContextCollection>;
	abstract save(
		sprintCollection: SprintContextCollection,
		user: User
	): Promise<void>;
}
