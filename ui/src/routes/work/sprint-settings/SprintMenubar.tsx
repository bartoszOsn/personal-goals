import { SprintId } from '@/models/Sprint.ts';
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarShortcut, MenubarTrigger } from '@/primitive/components/ui/menubar';
import { Spinner } from '@/primitive/components/ui/spinner';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useCreateSprintsMutation, useDeleteSprintsMutation, useFillSprintsMutation } from '@/api/sprint/sprint-hooks';

export function SprintMenubar({context, selectedSprintIds}: { context: number, selectedSprintIds: SprintId[] }) {
	const fillSprintsMutation = useFillSprintsMutation(context);
	const createSprintsMutation = useCreateSprintsMutation(context);
	const deleteWorkItemMutation = useDeleteSprintsMutation(context);

	return (
		<Menubar className='w-full'>
			<MenubarMenu>
				<MenubarTrigger>
					{
						fillSprintsMutation.isPending || createSprintsMutation.isPending
							? <Spinner className='mr-1' />
							: <PlusIcon className='w-4 h-4 mr-1' />
					}
					Create
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem onClick={() => createSprintsMutation.mutate()}>
						Create one
					</MenubarItem>
					<MenubarItem onClick={() => fillSprintsMutation.mutate()}>
						Fill whole year
					</MenubarItem>
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
						<MenubarItem disabled={selectedSprintIds.length === 0}
									 onClick={() => deleteWorkItemMutation.mutate(selectedSprintIds)}>
							Selected <MenubarShortcut>{selectedSprintIds.length}</MenubarShortcut>
						</MenubarItem>
					</MenubarGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	)
}