export class KeyResultProgress {
	constructor(public readonly progress: number) {
		if (this.progress < 0 || this.progress > 1) {
			throw new Error(
				`Progress must be between 0 and 1. Received ${this.progress}`
			);
		}
	}
}
