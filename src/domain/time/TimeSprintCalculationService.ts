import { Injectable } from '@nestjs/common';
import { SprintSettings, SprintSettingsDuration } from './model/SprintSettings';
import { RestPeriod } from './model/RestPeriod';
import { Sprint } from './model/Sprint';
import { Year } from './model/Year';
import { Quarter } from './model/Quarter';
import { UnreachableError } from '../../util/UnreachableError';

@Injectable()
export class TimeSprintCalculationService {
	private static readonly generationStart = new Date(1970, 0, 1);

	calculateSprints(
		settings: SprintSettings,
		restPeriods: RestPeriod[]
	): Sprint[] {
		const sprints: Sprint[] = [];
		const generateUntil = settings.generateUntil;
		const sprintDurationMs = this.getSprintDurationInMs(
			settings.sprintDuration
		);

		let currentDate = TimeSprintCalculationService.generationStart;
		const yearlySprintCounts = new Map<number, number>();

		while (currentDate < generateUntil) {
			const currentYear = currentDate.getFullYear();
			const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

			// Skip if current date is in a rest period
			if (this.isInRestPeriod(currentDate, restPeriods)) {
				currentDate = this.getNextDateAfterRestPeriod(
					currentDate,
					restPeriods
				);
				continue;
			}

			// Calculate sprint end date
			let sprintEnd = new Date(currentDate.getTime() + sprintDurationMs);

			// Ensure sprint doesn't cross year boundary
			if (sprintEnd > yearEnd) {
				sprintEnd = yearEnd;
			}

			// Check if sprint overlaps with rest period
			const restPeriodStart = this.getRestPeriodStartInRange(
				currentDate,
				sprintEnd,
				restPeriods
			);
			if (restPeriodStart) {
				// Shorten sprint to end before rest period
				sprintEnd = new Date(restPeriodStart.getTime() - 1);
			}

			// Only add sprint if it has positive duration
			if (sprintEnd > currentDate) {
				// Calculate yearly index
				const yearlyIndex =
					(yearlySprintCounts.get(currentYear) || 0) + 1;
				yearlySprintCounts.set(currentYear, yearlyIndex);

				const year = Year.of(currentYear);
				const quarter = this.getQuarter(currentDate);

				sprints.push(
					new Sprint(
						year,
						quarter,
						yearlyIndex,
						currentDate,
						sprintEnd
					)
				);
			}

			// Move to next sprint (day after current sprint end)
			currentDate = new Date(sprintEnd.getTime() + 1);

			// If we ended at year boundary, move to next year
			if (sprintEnd.getTime() === yearEnd.getTime()) {
				currentDate = new Date(currentDate.getFullYear() + 1, 0, 1);
			}
		}

		return sprints;
	}

	private getQuarter(date: Date): Quarter {
		const month = date.getMonth();
		if (month < 3) return Quarter.Q1;
		if (month < 6) return Quarter.Q2;
		if (month < 9) return Quarter.Q3;
		return Quarter.Q4;
	}

	private getSprintDurationInMs(duration: SprintSettingsDuration): number {
		switch (duration) {
			case SprintSettingsDuration.WEEK:
				return 7 * 24 * 60 * 60 * 1000;
			case SprintSettingsDuration.TWO_WEEKS:
				return 14 * 24 * 60 * 60 * 1000;
			case SprintSettingsDuration.MONTH:
				return 30 * 24 * 60 * 60 * 1000; // Approximate
			default:
				throw new UnreachableError(duration);
		}
	}

	private isInRestPeriod(date: Date, restPeriods: RestPeriod[]): boolean {
		return restPeriods.some(
			(period) => date >= period.start && date <= period.end
		);
	}

	private getNextDateAfterRestPeriod(
		date: Date,
		restPeriods: RestPeriod[]
	): Date {
		const overlappingPeriod = restPeriods.find(
			(period) => date >= period.start && date <= period.end
		);

		if (overlappingPeriod) {
			return new Date(overlappingPeriod.end.getTime() + 1);
		}

		return date;
	}

	private getRestPeriodStartInRange(
		start: Date,
		end: Date,
		restPeriods: RestPeriod[]
	): Date | null {
		for (const period of restPeriods) {
			const periodStart = period.start;
			if (periodStart > start && periodStart <= end) {
				return periodStart;
			}
		}
		return null;
	}
}
