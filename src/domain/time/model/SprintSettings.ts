export enum SprintSettingsDuration {
	WEEK = 'week',
	TWO_WEEKS = 'twoWeeks',
	MONTH = 'month'
}

export enum SprintSettingsQuarterAssignment {
	BEGINNING = 'beginning',
	END = 'end',
	BY_MAJORITY = 'byMajority'
}

export class SprintSettings {
	static readonly default = new SprintSettings(
		SprintSettingsDuration.TWO_WEEKS,
		SprintSettingsQuarterAssignment.BY_MAJORITY,
		this.getDateTenYearsInFuture()
	);

	constructor(
		public readonly sprintDuration: SprintSettingsDuration,
		public readonly quarterAssignment: SprintSettingsQuarterAssignment,
		public readonly generateUntil: Date
	) {}

	private static getDateTenYearsInFuture() {
		const now = new Date();
		return new Date(
			now.getFullYear() + 10,
			now.getMonth(),
			now.getDate(),
			now.getHours(),
			now.getMinutes(),
			now.getSeconds()
		);
	}
}
