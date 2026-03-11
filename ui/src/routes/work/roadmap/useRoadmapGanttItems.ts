import { WorkItem, WorkItemStatus, WorkItemType } from '@/models/WorkItem.ts';
import { GanttItem } from '@/base/gantt';
import { MantineColor } from '@mantine/core';
import { useMemo } from 'react';

export function useRoadmapGanttItems(items: WorkItem[]): GanttItem<WorkItem>[] {
	return useMemo(() => items.map(workItemToGanttItem), [items]);
}

function workItemToGanttItem(wi: WorkItem): GanttItem<WorkItem> {
	return {
		id: wi.id,
		data: wi,
		start: wi.timeFrame?.startDate,
		end: wi.timeFrame?.endDate,
		color: statusToColor(wi.status),
		backgroundColor: typeToColor(wi.type),
		tooltip: wi.title,
		linksInto: [],
		children: wi.children.map(workItemToGanttItem)
	}
}

function typeToColor(type: WorkItemType): MantineColor {
	switch (type) {
		case WorkItemType.TASK:
			return 'gray';
		case WorkItemType.OBJECTIVE:
			return 'grape';
		case WorkItemType.KEY_RESULT:
			return 'orange';
		default:
			throw new Error(`Unknown type: ${type}`);
	}
}

function statusToColor(status: WorkItemStatus): MantineColor {
	switch (status) {
		case WorkItemStatus.TODO:
			return 'gray';
		case WorkItemStatus.IN_PROGRESS:
			return 'blue';
		case WorkItemStatus.DONE:
			return 'green';
		case WorkItemStatus.FAILED:
			return 'red';
		default:
			throw new Error(`Unknown status: ${status}`);
	}
}
