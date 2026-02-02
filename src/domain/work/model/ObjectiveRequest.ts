import { RichText } from './RichText';
import { ObjectiveDeadline } from './Objective';

export class ObjectiveRequest {
	constructor(
		public readonly name: string | null,
		public readonly description: RichText | null,
		public readonly deadline: ObjectiveDeadline | null
	) {}
}
