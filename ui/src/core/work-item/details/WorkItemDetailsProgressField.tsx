import { WorkItem } from '@/models/WorkItem.ts';
import { Field, FieldLabel } from '@/primitive/components/ui/field';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { DotIcon } from 'lucide-react';
import { CircularProgress } from '@/primitive/components/customized/CircularProgress';

export function WorkItemDetailsProgressField({ workItem }: { workItem: WorkItem }) {
	return (
		<Field className='flex-1 min-w-0'>
			<FieldLabel>Progress</FieldLabel>
			<Item variant="outline" className="flex-1 overflow-hidden">
				<ItemMedia>
					<CircularProgress values={[{ value: workItem.progress.completed, strokeClass: 'stroke-green-700 dark:stroke-green-400' }, { value: workItem.progress.failed, strokeClass: 'stroke-destructive' }]} />
				</ItemMedia>
				<ItemContent>
					<ItemTitle className='gap-0'><DotIcon className='text-green-700 dark:text-green-400' />{workItem.progress.completed}% completed</ItemTitle>
					<ItemDescription className='flex items-center'><DotIcon className='text-destructive' />{workItem.progress.failed}% failed</ItemDescription>
				</ItemContent>
			</Item>
		</Field>
	)
}