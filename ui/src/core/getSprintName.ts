import type { SprintDTO } from '@personal-okr/shared';

export function getSprintName(sprint: SprintDTO): string {
	return `${sprint.year}-${sprint.quarter}-${sprint.yearlyIndex}`;
}