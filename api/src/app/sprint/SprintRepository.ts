import { ContextYear } from '../../domain/common/model/ContextYear';
import { SprintContextCollection } from '../../domain/sprint/model/SprintContextCollection';

export abstract class SprintRepository {
	abstract getSprintsByContext(
		context: ContextYear
	): Promise<SprintContextCollection>;
	abstract save(sprintCollection: SprintContextCollection): Promise<void>;
}
