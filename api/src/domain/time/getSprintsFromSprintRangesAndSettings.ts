import { SprintTimeRange } from './model/SprintTimeRange';
import {
	SprintSettings,
	SprintSettingsQuarterAssignment
} from './model/SprintSettings';
import { Sprint } from './model/Sprint';
import { Year } from './model/Year';
import { Quarter } from './model/Quarter';
import { SprintStatus } from './model/SprintStatus';
import { UnreachableError } from '../../util/UnreachableError';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';

export function getSprintsFromSprintRangesAndSettings(
	ranges: SprintTimeRange[],
	settings: SprintSettings,
	today: Temporal.PlainDate
): Sprint[] {
	return ranges.map((range) => {
		const id = range.id;
		const year = getSprintYearFromRange(range, settings);
		const quarter = getSprintQuarterFromRange(range, settings);
		const yearlyIndex = getSprintYearlyIndexFromRange(
			range,
			ranges,
			settings
		);
		const start = range.startDate;
		const end = range.endDate;
		const status = getSprintStatusFromRange(range, today);

		return new Sprint(id, year, quarter, yearlyIndex, start, end, status);
	});
}

// TODO: add SprintSettingsYearAssignment to settings, similar to SprintSettingsQuarterAssignment
function getSprintYearFromRange(
	range: SprintTimeRange,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_settings: SprintSettings
): Year {
	return Year.fromPlainDate(range.endDate);
}

function getSprintQuarterFromRange(
	range: SprintTimeRange,
	settings: SprintSettings
): Quarter {
	switch (settings.quarterAssignment) {
		case SprintSettingsQuarterAssignment.BEGINNING:
			return getQuartedByDate(range.startDate);
		case SprintSettingsQuarterAssignment.END:
			return getQuartedByDate(range.endDate);
		case SprintSettingsQuarterAssignment.BY_MAJORITY: {
			const middleOfSprint = range.startDate.add({
				days: Math.round(
					range.endDate.since(range.startDate).abs().total('days') / 2
				)
			});
			return getQuartedByDate(middleOfSprint);
		}
		default:
			throw new UnreachableError(settings.quarterAssignment);
	}
}

function getSprintYearlyIndexFromRange(
	range: SprintTimeRange,
	ranges: SprintTimeRange[],
	settings: SprintSettings
): number {
	// TODO: sprint year is calculated twice (First time in getSprintsFromSprintRangesAndSettings);
	const year = getSprintYearFromRange(range, settings);
	return ranges
		.filter((r) => getSprintYearFromRange(r, settings).equals(year))
		.toSorted((a, b) => a.startDate.since(b.startDate).sign)
		.indexOf(range);
}

function getSprintStatusFromRange(
	range: SprintTimeRange,
	today: Temporal.PlainDate
): SprintStatus {
	if (isPlainDate(range.endDate).before(today)) {
		return SprintStatus.COMPLETED;
	}
	if (isPlainDate(range.startDate).after(today)) {
		return SprintStatus.COMPLETED;
	}

	return SprintStatus.ACTIVE;
}

function getQuartedByDate(date: Temporal.PlainDate): Quarter {
	const month = date.month;
	if (month <= 3) {
		return Quarter.Q1;
	}
	if (month <= 6) {
		return Quarter.Q2;
	}
	if (month <= 9) {
		return Quarter.Q3;
	}

	return Quarter.Q4;
}
