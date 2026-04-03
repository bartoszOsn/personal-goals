import { Group, Progress, Text } from '@mantine/core';
import { WorkItem } from '@/models/WorkItem';

export interface WorkItemProgressInplaceProps {
	workItem: WorkItem;
}

export function WorkItemProgressInplace({ workItem }: WorkItemProgressInplaceProps) {
	return (
		<Group gap='xs' w='100%'>
			<Progress color={workItem.progress.completed === 100 ? 'green' : 'blue'} value={workItem.progress.completed} flex={1} />
			<Text size='xs' c='dimmed' w={30}>{workItem.progress.completed}%</Text>
		</Group>
	)
}