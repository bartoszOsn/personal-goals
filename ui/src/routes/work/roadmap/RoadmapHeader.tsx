import { WorkItemId, WorkItemType } from '@/models/WorkItem.ts';
import { Button, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateWorkItemMutation, useDeleteWorkItemsMutation } from '@/api/work-item/work-item-hooks';

export function RoadmapHeader({ context, selectedWorkItemIds }: { context: number, selectedWorkItemIds: WorkItemId[] }) {
	const createWorkItemMutation = useCreateWorkItemMutation();
	const deleteWorkItemMutation = useDeleteWorkItemsMutation();

	return (
		<Group gap='xs'>
			<Button size="xs"
					variant="outline"
					color='grape'
					leftSection={<IconPlus size={14} />}
					loading={createWorkItemMutation.isPending}
					onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.OBJECTIVE })}>Create Objective</Button>
			<Button size="xs"
					variant="outline"
					leftSection={<IconPlus size={14} />}
					loading={createWorkItemMutation.isPending}
					onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.TASK })}>Create Task</Button>
			<Button size="xs"
					variant="outline"
					color='red'
					leftSection={<IconTrash size={14} />}
					disabled={selectedWorkItemIds.length === 0}
					loading={deleteWorkItemMutation.isPending}
					onClick={() => deleteWorkItemMutation.mutate(selectedWorkItemIds)}>Delete</Button>
		</Group>
	)
}