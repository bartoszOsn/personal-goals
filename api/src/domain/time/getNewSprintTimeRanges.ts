import { SprintSettingsDuration } from './model/SprintSettings';
import { TimeRange } from './model/TimeRange';
import { Temporal } from 'temporal-polyfill';

export function getNewSprintTimeRanges(
	startDate: Temporal.PlainDate,
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
	startDate: Temporal.PlainDate,
	numberOfSprints: number
): TimeRange[] {
	const firstMondayAfterStartDate = getNextOrSameMonday(startDate);

	const result: TimeRange[] = [];
	let currentStart = firstMondayAfterStartDate;
	while (result.length < numberOfSprints) {
		const start = currentStart;
		const end = start.add({ weeks: weeksInRange }).subtract({ days: 1 });

		const range = new TimeRange(start, end);
		result.push(range);
		currentStart = end.add({ days: 1 });
	}

	return result;
}

function getNewSprintTimeRangesMonthly(
	monthsInRange: number,
	startDate: Temporal.PlainDate,
	numberOfSprints: number
): TimeRange[] {
	const firstMonthStartAfterStart = getNextOrSameFirstDayOfMonth(startDate);

	const result: TimeRange[] = [];
	let currentStart = firstMonthStartAfterStart;
	while (result.length < numberOfSprints) {
		const start = currentStart;
		const end = start.add({ months: monthsInRange }).subtract({ days: 1 });

		const range = new TimeRange(start, end);
		result.push(range);
		currentStart = end.add({ days: 1 });
	}

	return result;
}

function getNextOrSameMonday(
	startDate: Temporal.PlainDate
): Temporal.PlainDate {
	const dayOfWeek = startDate.dayOfWeek; // 1 = Monday, 7 = Sunday
	if (dayOfWeek === 1) {
		return startDate;
	}
	const daysUntilMonday = (8 - dayOfWeek) % 7;
	return startDate.add({ days: daysUntilMonday });
}

function getNextOrSameFirstDayOfMonth(
	startDate: Temporal.PlainDate
): Temporal.PlainDate {
	const date = startDate.day;
	if (date === 1) {
		return startDate;
	}
	const daysUntilFirst = startDate.daysInMonth - date;
	return startDate.add({ days: daysUntilFirst });
}
