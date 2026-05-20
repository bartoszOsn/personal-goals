import { WorkItem } from '@/models/WorkItem.ts';
import { Field, FieldLabel } from '@/primitive/components/ui/field';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { CircleDashedIcon } from 'lucide-react';
import { Progress } from '@/primitive/components/ui/progress';

export function WorkItemDetailsProgressField({ workItem }: { workItem: WorkItem }) {
	return (
		<Field>
			<FieldLabel>Progress /*TODO*/</FieldLabel>
			<Item variant="outline" className="flex-1">
				<ItemMedia><CircleDashedIcon className="text-muted-foreground" /></ItemMedia>
				<ItemContent>
					<ItemTitle>{workItem.progress.completed}%</ItemTitle>
					<ItemDescription><Progress className='mb-4' value={workItem.progress.completed} /></ItemDescription>
				</ItemContent>
			</Item>
		</Field>
	)
}