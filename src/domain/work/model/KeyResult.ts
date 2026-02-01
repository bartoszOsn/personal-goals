import { RichText } from './RichText';

export class KeyResult {
	constructor(
		public readonly id: KeyResultId,
		public readonly name: string,
		public readonly description: RichText,
		public readonly progress: KeyResultProgress
	) {}
}

class KeyResultId {
	constructor(public readonly id: string) {}
}

class KeyResultProgress {
	constructor(public readonly progress: number) {
		if (this.progress < 0 || this.progress > 1) {
			throw new Error(
				`Progress must be between 0 and 1. Received ${this.progress}`
			);
		}
	}
}
