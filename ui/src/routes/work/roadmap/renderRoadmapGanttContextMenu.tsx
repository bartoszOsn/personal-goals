import { GanttItem } from '@/base/gantt';
import { WorkItemOld, WorkItemId, WorkItemType } from '@/models/WorkItemOld.ts';
import { ReactNode } from 'react';
import { Menu } from '@mantine/core';
import { IconFile, IconPlus, IconTrash } from '@tabler/icons-react';
import { useCreateWorkItemMutation, useDeleteWorkItemsMutation } from '@/api/work-item-old/work-item-hooks';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal';

export function renderRoadmapGanttContextMenu(clickedOn: GanttItem<WorkItemOld>, selected: GanttItem<WorkItemOld>[], context: number) {
	return <RoadmapGanttContextMenu clickedOn={clickedOn} selected={selected} context={context} />;
}

function RoadmapGanttContextMenu({ clickedOn, selected, context }: { clickedOn: GanttItem<WorkItemOld>, selected: GanttItem<WorkItemOld>[], context: number }) {

	const createWorkItemMutation = useCreateWorkItemMutation();
	const deleteWorkItemsMutation = useDeleteWorkItemsMutation();
	const openWorkItemModal = useWorkItemDetailsModal();


	const createChildKeyResult = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.KEY_RESULT,
			parentId: clickedOn.data.id
		})
	}

	const createChildTask = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.TASK,
			parentId: clickedOn.data.id
		})
	}

	const deleteSelected = () => {
		deleteWorkItemsMutation.mutate(selected.map(s => s.id) as WorkItemId[])
	}

	const deleteClicked = () => {
		deleteWorkItemsMutation.mutate([clickedOn.data.id])
	}

	const options: ReactNode[] = [
		<Menu.Item leftSection={<IconFile size={14} />} onClick={() => openWorkItemModal(clickedOn.data.id)}>
			Details
		</Menu.Item>,
	];

	if (clickedOn.data.type === WorkItemType.OBJECTIVE) {
		options.push(
			<Menu.Item leftSection={<IconPlus size={14} />} onClick={createChildKeyResult}>
				Create child key result
			</Menu.Item>
		)
	}

	if (clickedOn.data.type === WorkItemType.KEY_RESULT) {
		options.push(
			<Menu.Item leftSection={<IconPlus size={14} />} onClick={createChildTask}>
				Create child task
			</Menu.Item>
		)
	}

	if (selected.some(s => s.id === clickedOn.id) && selected.length > 1) {
		options.push(
			<Menu.Item color='red' leftSection={<IconTrash size={14} />} onClick={deleteSelected}>
				Delete {selected.length} selected
			</Menu.Item>
		)
	} else {
		options.push(
			<Menu.Item color='red' leftSection={<IconTrash size={14} />} onClick={deleteClicked}>
				Delete "{clickedOn.data.title}"
			</Menu.Item>
		)
	}

	return options;
}