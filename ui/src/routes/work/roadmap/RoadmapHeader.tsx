import { Button, Group } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateWorkItemInHierarchyMutation, useDeleteWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { WorkItemId, WorkItemType } from '@/models/WorkItem';

export function RoadmapHeader({ context, selectedWorkItemIds }: { context: number, selectedWorkItemIds: WorkItemId[] }) {
	const createWorkItemMutation = useCreateWorkItemInHierarchyMutation();
	const deleteWorkItemMutation = useDeleteWorkItemsInHierarchyMutation();

	return (
		<Group gap='xs'>
			<Button size="xs"
					variant="outline"
					color='grape'
					leftSection={<IconPlus size={14} />}
					loading={createWorkItemMutation.isPending}
					onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.GOAL })}>Create Goal</Button>
			<Button size="xs"
					variant="outline"
					leftSection={<IconPlus size={14} />}
					loading={createWorkItemMutation.isPending}
					onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.GROUP })}>Create Group</Button>
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
					onClick={() => deleteWorkItemMutation.mutate({ context: context, ids: selectedWorkItemIds})}>Delete</Button>
		</Group>
	)
}