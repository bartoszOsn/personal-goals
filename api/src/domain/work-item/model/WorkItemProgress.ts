import { WorkItemStatus } from './WorkItemStatus';

export interface IObjectWithProgressAndStatus {
	status: WorkItemStatus;
	progress: WorkItemProgress;
	children: ReadonlyArray<IObjectWithProgressAndStatus>;
}

export abstract class WorkItemProgress {
	protected target: IObjectWithProgressAndStatus;

	abstract getPercentage(): Percentage;
	abstract getManualPercentage(): Percentage | null;
	abstract canChange(): boolean;

	setTarget(target: IObjectWithProgressAndStatus): void {
		this.target = target;
	}
}

export class ManualWorkItemProgress extends WorkItemProgress {
	constructor(private readonly percentage: Percentage) {
		super();
	}

	override getPercentage(): Percentage {
		if (this.target.status === WorkItemStatus.DONE) {
			return Percentage.full();
		}
		return this.percentage;
	}

	override getManualPercentage(): Percentage | null {
		return this.percentage;
	}

	override canChange(): boolean {
		return this.target.status !== WorkItemStatus.DONE;
	}
}

export class ChildrenProgressBasedWorkItemProgress extends WorkItemProgress {
	override getPercentage(): Percentage {
		return Percentage.average(
			this.target.children.map((c) => c.progress.getPercentage())
		);
	}

	override getManualPercentage(): Percentage | null {
		return null;
	}

	override canChange(): boolean {
		return false;
	}
}

export class ChildrenStatusBasedWorkItemProgress extends WorkItemProgress {
	override getPercentage(): Percentage {
		const doneCount = this.target.children.filter(
			(c) => c.status === WorkItemStatus.DONE
		).length;
		return Percentage.fraction(doneCount, this.target.children.length);
	}

	override getManualPercentage(): Percentage | null {
		return null;
	}

	override canChange(): boolean {
		return false;
	}
}

export class Percentage {
	private constructor(public readonly value: number) {
		if (value < 0 || value > 100) {
			throw new Error('Percentage value must be between 0 and 100');
		}
	}

	static from(value: number): Percentage {
		return new Percentage(Math.round(value));
	}

	static average(percentages: Percentage[]): Percentage {
		const sum = percentages.reduce((sum, curr) => sum + curr.value, 0);
		return Percentage.from(sum / percentages.length);
	}

	static fraction(value: number, outOf: number): Percentage {
		return Percentage.from((value / outOf) * 100);
	}

	static zero(): Percentage {
		return Percentage.from(0);
	}

	static full(): Percentage {
		return Percentage.from(100);
	}

	isFull(): boolean {
		return this.value === 100;
	}
}
