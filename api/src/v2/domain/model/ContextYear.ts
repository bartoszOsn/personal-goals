export class ContextYear {
	constructor(public year: number) {}

	equals(other: ContextYear) {
		return this.year === other.year;
	}
}
