import { Sprint } from '@/models/Sprint';

export function getSprintName(sprint: Sprint): string {
	return `${sprint.year}-${sprint.quarter}-${sprint.yearlyIndex}`;
}