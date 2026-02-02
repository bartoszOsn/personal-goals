export class RestPeriod {
	constructor(
		public readonly id: RestPeriodId,
		public readonly name: string | null,
		public readonly start: Date,
		public readonly end: Date
	) {}
}

export class RestPeriodId {
	constructor(private id: string) {}

	getId() {
		return this.id;
	}
}
