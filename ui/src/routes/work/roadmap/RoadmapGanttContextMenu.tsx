import { WorkItem, WorkItemId, WorkItemType } from '@/models/WorkItem';
import { useCreateWorkItemInHierarchyMutation, useDeleteWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal';
import { ReactNode } from 'react';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger
} from '@/primitive/components/ui/context-menu.tsx';
import { FileIcon, PlusIcon, TrashIcon } from 'lucide-react';

export function RoadmapGanttContextMenu({ children, clickedOn, selected, context }: {
	children: ReactNode,
	clickedOn: WorkItem,
	selected: WorkItemId[],
	context: number
}) {

	const createWorkItemMutation = useCreateWorkItemInHierarchyMutation();
	const deleteWorkItemsMutation = useDeleteWorkItemsInHierarchyMutation();
	const openWorkItemModal = useWorkItemDetailsModal();


	const createChildGoal = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.GOAL,
			parentId: clickedOn.id
		});
	};

	const createChildGroup = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.GROUP,
			parentId: clickedOn.id
		});
	};

	const createChildTask = () => {
		createWorkItemMutation.mutate({
			context,
			type: WorkItemType.TASK,
			parentId: clickedOn.id
		});
	};

	const deleteSelected = () => {
		deleteWorkItemsMutation.mutate({ context, ids: selected });
	};

	const deleteClicked = () => {
		deleteWorkItemsMutation.mutate({ context, ids: [clickedOn.id] });
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuGroup>
					<ContextMenuItem onClick={() => openWorkItemModal(clickedOn.id)}>
						<FileIcon /> Details
					</ContextMenuItem>
				</ContextMenuGroup>
				<ContextMenuSeparator />
				{
					clickedOn.type !== WorkItemType.TASK && (
						<>
							<ContextMenuGroup>
								<ContextMenuItem onClick={createChildGoal}>
									<PlusIcon /> Create child goal
								</ContextMenuItem>
								<ContextMenuItem onClick={createChildGroup}>
									<PlusIcon /> Create child group
								</ContextMenuItem>
								<ContextMenuItem onClick={createChildTask}>
									<PlusIcon /> Create child task
								</ContextMenuItem>
							</ContextMenuGroup>
							<ContextMenuSeparator />
						</>
					)
				}
				<ContextMenuGroup>
					{
						selected.some(s => s === clickedOn.id) && selected.length > 1
							? (
								<ContextMenuItem variant='destructive' onClick={deleteSelected}>
									<TrashIcon /> Delete {selected.length} selected
								</ContextMenuItem>
							) : (
								<ContextMenuItem variant='destructive'  onClick={deleteClicked}>
									<TrashIcon /> Delete "{clickedOn.title}"
								</ContextMenuItem>
							)
					}
				</ContextMenuGroup>
			</ContextMenuContent>
		</ContextMenu>
	);
}