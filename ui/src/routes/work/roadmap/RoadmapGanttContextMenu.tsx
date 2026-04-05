import { GanttItem } from '@/base/gantt';
import { WorkItem, WorkItemType } from '@/models/WorkItem';
import { useCreateWorkItemInHierarchyMutation, useDeleteWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal';
import { Menu } from '@mantine/core';
import { IconFile, IconPlus, IconTrash } from '@tabler/icons-react';

export function RoadmapGanttContextMenu({ clickedOn, selected, context }: {
	clickedOn: GanttItem<WorkItem>,
	selected: GanttItem<WorkItem>[],
	context: number
}) {

	const createWorkItemMutation = useCreateWorkItemInHierarchyMutation();
	const deleteWorkItemsMutation = useDeleteWorkItemsInHierarchyMutation();
	const openWorkItemModal = useWorkItemDetailsModal();


	const createChildGoal = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.GOAL,
			parentId: clickedOn.data.id
		});
	};

	const createChildGroup = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.GROUP,
			parentId: clickedOn.data.id
		});
	};

	const createChildTask = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.TASK,
			parentId: clickedOn.data.id
		});
	};

	const deleteSelected = () => {
		deleteWorkItemsMutation.mutate({ context, ids: selected.map(s => s.data.id) });
	};

	const deleteClicked = () => {
		deleteWorkItemsMutation.mutate({ context, ids: [clickedOn.data.id] });
	};

	return (
		<>
			<Menu.Item leftSection={<IconFile size={14} />} onClick={() => openWorkItemModal(clickedOn.data.id)}>
				Details
			</Menu.Item>
			{
				clickedOn.data.type !== WorkItemType.TASK && (
					<>
						<Menu.Item leftSection={<IconPlus size={14} />} onClick={createChildGoal}>
							Create child goal
						</Menu.Item>
						<Menu.Item leftSection={<IconPlus size={14} />} onClick={createChildGroup}>
							Create child group
						</Menu.Item>
						<Menu.Item leftSection={<IconPlus size={14} />} onClick={createChildTask}>
							Create child task
						</Menu.Item>
					</>
				)
			}
			{
				selected.some(s => s.id === clickedOn.id) && selected.length > 1
					? (
						<Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={deleteSelected}>
							Delete {selected.length} selected
						</Menu.Item>
					) : (
						<Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={deleteClicked}>
							Delete "{clickedOn.data.title}"
						</Menu.Item>
					)
			}
		</>
	);
}