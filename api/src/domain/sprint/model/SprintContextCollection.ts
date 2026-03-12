import { ContextYear } from '../../common/model/ContextYear';
import { Sprint } from './Sprint';

export abstract class SprintContextCollection {
	constructor(
		public readonly context: ContextYear,
		public readonly sprints: ReadonlyArray<Sprint>
	) {}
}
