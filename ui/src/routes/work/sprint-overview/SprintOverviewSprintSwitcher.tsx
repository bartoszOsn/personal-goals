import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { SprintId } from '@/models/Sprint.ts';
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious } from '@/primitive/components/ui/pagination.tsx';
import { Skeleton } from '@/primitive/components/ui/skeleton.tsx';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/primitive/components/ui/combobox.tsx';

export function SprintOverviewSprintSwitcher
({ context, sprintId, onChange }: { context: number, sprintId: SprintId, onChange: (value: SprintId) => void }) {
	const sprintQuery = useSprintQuery(context);

	if (sprintQuery.isPending || !sprintQuery.data) {
		return <Skeleton className='h-5 w-full' />
	}

	const value = sprintQuery.data.findIndex(s => s.id === sprintId) + 1;
	const total = sprintQuery.data.length;

	const sprint = sprintQuery.data.find(s => s.id === sprintId);
	const onSprintSelect = (index: number) => {
		onChange(sprintQuery.data[index - 1].id);
	}

	return (
		<Pagination>
			<PaginationContent>
				<PaginationPrevious onClick={() => value > 0 && onSprintSelect(value - 1)} />
				<Combobox items={sprintQuery.data}
						  value={sprint}
						  itemToStringValue={sprint => sprint.id}
						  itemToStringLabel={sprint => sprint.name}
						  onValueChange={sprint => sprint && onChange(sprint.id)}>
					<ComboboxInput />
					<ComboboxContent>
						<ComboboxEmpty>No sprints available</ComboboxEmpty>
						<ComboboxList>
							{(item) => (
								<ComboboxItem key={item.id} value={item}>
									{item.name}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
				<PaginationNext onClick={() => value < total && onSprintSelect(value + 1)} />
			</PaginationContent>
		</Pagination>
	)
}