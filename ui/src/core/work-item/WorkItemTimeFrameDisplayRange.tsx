import { WorkItem } from '@/models/WorkItem.ts';
import { formatTimeRange } from '@/base/formatTimeRange';

export function WorkItemTimeFrameDisplayRange({ workItem }: { workItem: WorkItem }) {
	if (!workItem.timeFrame) {
		return null;
	}

	return formatTimeRange(workItem.timeFrame.startDate, workItem.timeFrame.endDate);
}