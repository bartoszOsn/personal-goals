import { useCreateWorkItemInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { WorkItemType } from '@/models/WorkItem';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/primitive/components/ui/empty';
import { CircleOff } from 'lucide-react';
import { Spinner } from '@/primitive/components/ui/spinner';
import { Button } from '@/primitive/components/ui/button';

export function RoadmapEmptySplashScreen({ context }: { context: number }) {
	const workItemMutation = useCreateWorkItemInHierarchyMutation();

	const addGoal = () => {
		workItemMutation.mutate({
			context,
			type: WorkItemType.GOAL
		});
	}

	const addGroup = () => {
		workItemMutation.mutate({
			context,
			type: WorkItemType.GROUP
		})
	}

	const addTask = () => {
		workItemMutation.mutate({
			context,
			type: WorkItemType.TASK
		})
	}

	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					{
						workItemMutation.isPending
						? <Spinner />
						: <CircleOff />
					}
				</EmptyMedia>
				<EmptyTitle>No work items</EmptyTitle>
				<EmptyDescription>Create one of the possible work item types to start working.</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2 flex-wrap">
				<Button onClick={addGoal}>Create Goal</Button>
				<Button variant='outline' onClick={addGroup}>Create Task</Button>
				<Button variant='outline' onClick={addTask}>Create Group</Button>
			</EmptyContent>
		</Empty>
	);
}