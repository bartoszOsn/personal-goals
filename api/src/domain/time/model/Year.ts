export class Year {
	private constructor(private readonly year: number) {}

	public static of(year: number): Year {
		return new Year(year);
	}

	public static fromString(year: string): Year {
		if (isNaN(+year)) {
			throw new Error('Year must be a number');
		}
		return this.of(+year);
	}

	public toString() {
		return this.year.toString();
	}

	public getValue(): number {
		return this.year;
	}
}
