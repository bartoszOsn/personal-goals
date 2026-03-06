import { WorkItemStatus } from './WorkItemStatus';

export interface IObjectWithProgressAndStatus {
	status: WorkItemStatus;
	progress: WorkItemProgress;
	children: ReadonlyArray<IObjectWithProgressAndStatus>;
}

export abstract class WorkItemProgress {
	protected target: IObjectWithProgressAndStatus;

	abstract getPercentage(): Percentage;

	setTarget(target: IObjectWithProgressAndStatus): void {
		this.target = target;
	}
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
	override getPercentage(): Percentage {
		return Percentage.average(
			this.target.children.map((c) => c.progress.getPercentage())
		);
	}
}

export class ChildrenStatusBasedWorkItemProgress extends WorkItemProgress {
	override getPercentage(): Percentage {
		const doneCount = this.target.children.filter(
			(c) => c.status === WorkItemStatus.DONE
		).length;
		return Percentage.fraction(doneCount, this.target.children.length);
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
