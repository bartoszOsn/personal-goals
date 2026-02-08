import { SprintSettings, SprintSettingsDuration } from './model/SprintSettings';
import { Sprint } from './model/Sprint';
import { Year } from './model/Year';
import { Quarter } from './model/Quarter';
import { UnreachableError } from '../../util/UnreachableError';
import { SprintStatus } from './model/SprintStatus';

export class TimeSprintCalculator {
	private static readonly generationStart = new Date(1970, 0, 1);

	calculateSprints(settings: SprintSettings): Sprint[] {
		const sprints: Sprint[] = [];
		const generateUntil = settings.generateUntil;
		const sprintDurationMs = this.getSprintDurationInMs(
			settings.sprintDuration
		);

		let currentDate = TimeSprintCalculator.generationStart;
		const yearlySprintCounts = new Map<number, number>();

		while (currentDate < generateUntil) {
			const currentYear = currentDate.getFullYear();
			const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);

			// Calculate sprint end date
			let sprintEnd = new Date(currentDate.getTime() + sprintDurationMs);

			// Ensure sprint doesn't cross year boundary
			if (sprintEnd > yearEnd) {
				sprintEnd = yearEnd;
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
						sprintEnd,
						this.getSprintStatus(currentDate, sprintEnd)
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

	private getSprintStatus(sprintStart: Date, sprintEnd: Date): SprintStatus {
		const now = new Date();
		if (sprintEnd < now) {
			return SprintStatus.COMPLETED;
		}
		if (sprintStart > now) {
			return SprintStatus.FUTURE;
		}

		return SprintStatus.ACTIVE;
	}
}
