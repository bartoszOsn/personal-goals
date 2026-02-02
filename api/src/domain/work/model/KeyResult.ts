import { RichText } from './RichText';
import { KeyResultProgress } from './KeyResultProgress';

export class KeyResult {
	constructor(
		public readonly id: KeyResultId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly progress: KeyResultProgress
	) {}
}

export class KeyResultId {
	constructor(public readonly id: string) {}
}
