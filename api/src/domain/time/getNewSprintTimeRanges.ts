import { SprintSettingsDuration } from './model/SprintSettings';
import { TimeRange } from './model/TimeRange';

export function getNewSprintTimeRanges(
	startDate: Date,
	numberOfSprints: number,
	sprintDuration: SprintSettingsDuration
): TimeRange[] {
	switch (sprintDuration) {
		case SprintSettingsDuration.WEEK:
			return getNewSprintTimeRangesWeekly(1, startDate, numberOfSprints);
		case SprintSettingsDuration.TWO_WEEKS:
			return getNewSprintTimeRangesWeekly(2, startDate, numberOfSprints);
		case SprintSettingsDuration.MONTH:
			return getNewSprintTimeRangesMonthly(1, startDate, numberOfSprints);
	}
}

export function getNewSprintTimeRangesWeekly(
	weeksInRange: number,
	startDate: Date,
	numberOfSprints: number
): TimeRange[] {
	const firstMondayAfterStartDate = new Date(startDate);
	firstMondayAfterStartDate.setDate(
		firstMondayAfterStartDate.getDate() +
			7 -
			firstMondayAfterStartDate.getDay()
	);

	const result: TimeRange[] = [];
	let currentStart = firstMondayAfterStartDate;
	while (result.length < numberOfSprints) {
		const start = currentStart;
		const end = new Date(start);
		end.setDate(end.getDate() + 7 * weeksInRange);

		const range = new TimeRange(start, end);
		result.push(range);
		currentStart = new Date(end);
		currentStart.setDate(currentStart.getDate() + 1);
	}

	return result;
}

function getNewSprintTimeRangesMonthly(
	monthsInRange: number,
	startDate: Date,
	numberOfSprints: number
): TimeRange[] {
	const firstMonthStartAfterStart = new Date(startDate);
	firstMonthStartAfterStart.setMonth(
		firstMonthStartAfterStart.getMonth() + 1
	);
	firstMonthStartAfterStart.setDate(1);

	const result: TimeRange[] = [];
	let currentStart = firstMonthStartAfterStart;
	while (result.length < numberOfSprints) {
		const start = currentStart;
		const end = new Date(start);
		end.setMonth(end.getMonth() + monthsInRange);

		const range = new TimeRange(start, end);
		result.push(range);
		currentStart = new Date(end);
		currentStart.setDate(currentStart.getDate() + 1);
	}

	return result;
}
