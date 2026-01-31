export class SprintSettings {
	constructor(
		public readonly sprintDuration: SprintSettingsDuration,
		public readonly quarterAssignment: SprintSettingsQuarterAssignment,
		public readonly generateUntil: Date
	) {}
}

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
