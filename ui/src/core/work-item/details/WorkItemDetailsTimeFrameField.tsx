import { WorkItem } from '@/models/WorkItem.ts';
import { Field, FieldLabel } from '@/primitive/components/ui/field.tsx';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item.tsx';
import { CalendarDaysIcon, ChevronRightIcon } from 'lucide-react';
import { WorkItemTimeFramePicker } from '@/core/work-item/WorkItemTimeFramePicker.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';
import { WorkItemTimeFrameDisplayRange } from '@/core/work-item/WorkItemTimeFrameDisplayRange.tsx';
import { WorkItemTimeFrameDisplayName } from '@/core/work-item/WorkItemTimeFrameDisplayName.tsx';

export function WorkItemDetailsTimeFrameField({ workItem }: { workItem: WorkItem }) {
	return (
		<Field>
			<FieldLabel>Time frame</FieldLabel>
			<WorkItemTimeFramePicker workItem={workItem}>
				<Item variant="outline" className="flex-1" asChild>
					<button>
						<ItemMedia><CalendarDaysIcon /></ItemMedia>
						<ItemContent className='overflow-x-hidden'>
							<Tooltip>
								<TooltipTrigger asChild>
									<ItemTitle className='max-w-full text-ellipsis inline'>
										<WorkItemTimeFrameDisplayRange workItem={workItem} />
									</ItemTitle>
								</TooltipTrigger>
								<TooltipContent>
									<WorkItemTimeFrameDisplayRange workItem={workItem} />
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<ItemDescription className='text-ellipsis'>
										<WorkItemTimeFrameDisplayName workItem={workItem} />
									</ItemDescription>
								</TooltipTrigger>
								<TooltipContent>
									<WorkItemTimeFrameDisplayName workItem={workItem} />
								</TooltipContent>
							</Tooltip>
						</ItemContent>
						<ItemActions>
							<ChevronRightIcon className="size-4" />
						</ItemActions>
					</button>
				</Item>
			</WorkItemTimeFramePicker>
		</Field>
	)
}