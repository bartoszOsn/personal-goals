export class RestPeriodRequest {
	public constructor(
		public readonly name: string | null,
		public readonly start: Date,
		public readonly end: Date
	) {}
}
