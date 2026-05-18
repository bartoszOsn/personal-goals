import { WorkItemType } from '@/models/WorkItem.ts';

export const workItemTypeToLabel: Record<WorkItemType, string> = {
	[WorkItemType.TASK]: 'Task',
	[WorkItemType.GROUP]: 'Group',
	[WorkItemType.GOAL]: 'Goal'
};