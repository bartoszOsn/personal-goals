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

export function getSprintsFromSprintRangesAndSettings(
	ranges: SprintTimeRange[],
	settings: SprintSettings,
	today: Date
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
	return Year.of(range.endDate.getFullYear());
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
			const middleOfSprint = new Date(
				range.startDate.getTime() +
					(range.endDate.getTime() - range.startDate.getTime()) / 2
			);
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
		.toSorted((a, b) => a.startDate.getTime() - b.startDate.getTime())
		.indexOf(range);
}

function getSprintStatusFromRange(
	range: SprintTimeRange,
	today: Date
): SprintStatus {
	if (range.endDate < today) {
		return SprintStatus.COMPLETED;
	}
	if (range.startDate > today) {
		return SprintStatus.COMPLETED;
	}

	return SprintStatus.ACTIVE;
}

function getQuartedByDate(date: Date): Quarter {
	const month = date.getMonth() + 1;
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
