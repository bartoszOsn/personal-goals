import { ProgressCalculationType } from './ProgressCalculationType';

export class KeyResultProgress {
	constructor(
		public readonly progress: number,
		public readonly calculationType: ProgressCalculationType
	) {
		if (this.progress < 0 || this.progress > 1) {
			throw new Error(
				`Progress must be between 0 and 1. Received ${this.progress}`
			);
		}
	}
}
