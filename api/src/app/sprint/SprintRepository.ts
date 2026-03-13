import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';
import { User } from '../../domain/auth/model/User';
import { SprintId } from '../../domain/sprint/model/SprintId';
import { Sprint } from '../../domain/sprint/model/Sprint';

export abstract class SprintRepository {
	abstract getSprintsByContext(
		context: ContextYear,
		user: User
	): Promise<SprintContextCollection>;
	abstract getSprintById(id: SprintId, user: User): Promise<Sprint | null>;
	abstract save(
		sprintCollection: SprintContextCollection,
		user: User
	): Promise<void>;
}
