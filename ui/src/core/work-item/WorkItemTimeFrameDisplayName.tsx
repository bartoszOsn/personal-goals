import { WorkItem, WorkItemTimeFrameType } from '@/models/WorkItem.ts';
import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { quarterToNumber } from '@/models/Quarter.ts';
import { Spinner } from '@/primitive/components/ui/spinner.tsx';

export function WorkItemTimeFrameDisplayName({ workItem }: { workItem: WorkItem }) {
	const sprints = useSprintQuery(workItem.contextYear);

	const sprint = sprints.data?.find(sprint => workItem.timeFrame?.type === WorkItemTimeFrameType.SPRINT && workItem.timeFrame.sprintId === sprint.id);
	const sprintName = sprint?.name;

	if (!workItem.timeFrame) {
		return 'No time frame';
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.WHOLE_YEAR) {
		return workItem.timeFrame.context.toString();
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.QUARTER) {
		return `Q${quarterToNumber[workItem.timeFrame.quarter]}`;
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.SPRINT) {
		if (!sprints.data || sprints.isLoading) {
			return <Spinner />
		}

		return sprintName;
	}

	return 'Custom dates';
}