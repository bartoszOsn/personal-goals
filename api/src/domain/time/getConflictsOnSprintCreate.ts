import { TimeRange } from './model/TimeRange';
import { SprintTimeRange } from './model/SprintTimeRange';

export function getConflictsOnSprintCreate(
	timeRanges: TimeRange[],
	currentRanges: SprintTimeRange[]
): SprintTimeRange[] {
	const result = new Set<SprintTimeRange>();

	for (const timeRange of timeRanges) {
		for (const currentRange of currentRanges) {
			if (timeRange.overlaps(currentRange)) {
				result.add(currentRange);
			}
		}
	}

	return Array.from(result);
}
