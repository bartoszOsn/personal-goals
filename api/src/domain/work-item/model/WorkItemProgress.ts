export class WorkItemProgress {
	constructor(
		public readonly completed: Percentage,
		public readonly failed: Percentage
	) {
		if (completed.value + failed.value > 100) {
			throw new Error(
				'Completed and failed percentages cannot exceed 100'
			);
		}
	}

	static empty(): WorkItemProgress {
		return new WorkItemProgress(Percentage.zero(), Percentage.zero());
	}

	static fullyCompleted(): WorkItemProgress {
		return new WorkItemProgress(Percentage.full(), Percentage.zero());
	}

	static fullyFailed(): WorkItemProgress {
		return new WorkItemProgress(Percentage.zero(), Percentage.full());
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
		return Percentage.from(value / outOf);
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
