import { WorkItem, WorkItemId } from '@/models/WorkItem';
import { DeepHierarchyTimelineItem } from '@/base/timeline/api/TimelineProps';

export function useRoadmapGanttItems(items: WorkItem[]): DeepHierarchyTimelineItem<WorkItemId, WorkItem>[] {
	return items.map(workItemToGanttItem)
}

function workItemToGanttItem(wi: WorkItem): DeepHierarchyTimelineItem<WorkItemId, WorkItem> {
	return {
		id: wi.id,
		data: wi,
		dates: wi.timeFrame ? { from: wi.timeFrame.startDate, to: wi.timeFrame.endDate } : undefined,
		children: wi.children.map(workItemToGanttItem)
	}
}
