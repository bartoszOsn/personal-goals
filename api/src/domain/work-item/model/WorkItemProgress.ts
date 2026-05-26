export class WorkItemProgress {
	private constructor(
		public readonly completed: Percentage,
		public readonly failed: Percentage
	) {
		if (completed.value + failed.value > 100) {
			throw new Error(
				'Completed and failed percentages cannot exceed 100'
			);
		}
	}

	static from(completed: Percentage, failed: Percentage): WorkItemProgress {
		const sum = completed.value + failed.value;
		// handle rounding error
		if (sum > 100 && sum <= 101) {
			const overLimit = sum - 100;
			return new WorkItemProgress(
				completed,
				Percentage.from(failed.value - overLimit)
			);
		}

		return new WorkItemProgress(completed, failed);
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
