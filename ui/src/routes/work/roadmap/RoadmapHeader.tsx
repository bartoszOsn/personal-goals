import { useCreateWorkItemInHierarchyMutation, useDeleteWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { WorkItemId, WorkItemType } from '@/models/WorkItem';
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from '@/primitive/components/ui/menubar';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { Spinner } from '@/primitive/components/ui/spinner';

export function RoadmapHeader({ context, selectedWorkItemIds }: { context: number, selectedWorkItemIds: WorkItemId[] }) {
	const createWorkItemMutation = useCreateWorkItemInHierarchyMutation();
	const deleteWorkItemMutation = useDeleteWorkItemsInHierarchyMutation();

	return (
		<Menubar className='w-full'>
			<MenubarMenu>
				<MenubarTrigger>
					{
						createWorkItemMutation.isPending
						? <Spinner className='mr-1' />
						: <PlusIcon className='w-4 h-4 mr-1' />
					}
					Create
				</MenubarTrigger>
				<MenubarContent>
					<MenubarGroup>
						<MenubarItem onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.GOAL })}>
							Goal
						</MenubarItem>
						<MenubarItem onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.GROUP })}>
							Group
						</MenubarItem>
						<MenubarItem onClick={() => createWorkItemMutation.mutate({ context: context, type: WorkItemType.TASK })}>
							Task
						</MenubarItem>
					</MenubarGroup>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					{
						deleteWorkItemMutation.isPending
						? <Spinner className='mr-1' />
						: <TrashIcon className='w-4 h-4 mr-1' />
					}
					{' '}Delete
				</MenubarTrigger>
				<MenubarContent>
					<MenubarGroup>
						<MenubarItem disabled={selectedWorkItemIds.length === 0}
									 onClick={() => deleteWorkItemMutation.mutate({ context: context, ids: selectedWorkItemIds })}>
							Selected <MenubarShortcut>{selectedWorkItemIds.length}</MenubarShortcut>
						</MenubarItem>
					</MenubarGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}