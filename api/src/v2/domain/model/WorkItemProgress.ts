import { WorkItemStatus } from './WorkItemStatus';

export abstract class WorkItemProgress {
	abstract getPercentage(): Percentage;
}

export class ManualWorkItemProgress extends WorkItemProgress {
	constructor(private readonly percentage: Percentage) {
		super();
	}

	getPercentage(): Percentage {
		return this.percentage;
	}
}

export class ChildrenProgressBasedWorkItemProgress extends WorkItemProgress {
	constructor(
		private readonly childProgresses: ReadonlyArray<WorkItemProgress>
	) {
		super();
	}

	override getPercentage(): Percentage {
		return Percentage.average(
			this.childProgresses.map((p) => p.getPercentage())
		);
	}
}

export class ChildrenStatusBasedWorkItemProgress extends WorkItemProgress {
	constructor(private readonly childStatuses: ReadonlyArray<WorkItemStatus>) {
		super();
	}

	override getPercentage(): Percentage {
		const doneCount = this.childStatuses.filter(
			(s) => s === WorkItemStatus.DONE
		).length;
		return Percentage.fraction(doneCount, this.childStatuses.length);
	}
}

export class Percentage {
	private constructor(public readonly value: number) {
		if (value < 0 || value > 1) {
			throw new Error('Percentage value must be between 0 and 1');
		}
	}

	static from(value: number): Percentage {
		return new Percentage(value);
	}

	static average(percentages: Percentage[]): Percentage {
		const sum = percentages.reduce((sum, curr) => sum + curr.value, 0);
		return Percentage.from(sum / percentages.length);
	}

	static fraction(value: number, outOf: number): Percentage {
		return Percentage.from(value / outOf);
	}

	static zero(): Percentage {
		return Percentage.from(0);
	}

	isFull(): boolean {
		return this.value === 1;
	}
}
