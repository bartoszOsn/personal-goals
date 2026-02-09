import { SprintTimeRange } from './model/SprintTimeRange';

export function getConflictsOnSprintUpdate(
	sprintsToUpdate: SprintTimeRange[],
	allCurrentSprints: SprintTimeRange[]
) {
	const allSprintsAfterChange = allCurrentSprints.map(
		(sprint) =>
			sprintsToUpdate.find((s) => s.id.equals(sprint.id)) ?? sprint
	);

	const conflicts = new Map<SprintTimeRange, SprintTimeRange[]>();
	for (let sprintTimeRange of sprintsToUpdate) {
		const conflictsForSprint = allSprintsAfterChange.filter(
			(s) =>
				!s.id.equals(sprintTimeRange.id) && s.overlaps(sprintTimeRange)
		);
		if (conflictsForSprint.length > 0) {
			conflicts.set(sprintTimeRange, conflictsForSprint);
		}
	}

	return conflicts;
}
