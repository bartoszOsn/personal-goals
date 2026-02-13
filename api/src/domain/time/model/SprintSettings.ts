import { Temporal } from 'temporal-polyfill';

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
		public readonly generateUntil: Temporal.PlainDate
	) {}

	private static getDateTenYearsInFuture(): Temporal.PlainDate {
		return Temporal.Now.plainDateISO().add({ years: 10 });
	}
}
