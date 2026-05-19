import { WorkItem } from '@/models/WorkItem.ts';

export function WorkItemTimeFrameDisplayRange({ workItem }: { workItem: WorkItem }) {
	if (!workItem.timeFrame) {
		return null;
	}

	return (
		<>
			{workItem.timeFrame.startDate.toLocaleString(undefined, { day: 'numeric', month: 'short' })}
			{' – '}
			{workItem.timeFrame.endDate.toLocaleString(undefined, { day: 'numeric', month: 'short' })}
		</>
	);
}