import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { WorkItem } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { FieldGroup } from '@/primitive/components/ui/field';
import { WorkItemDetailsTimeFrameField } from '@/core/work-item/details/WorkItemDetailsTimeFrameField';
import { WorkItemDetailsStatusField } from '@/core/work-item/details/WorkItemDetailsStatusField';
import { WorkItemDetailsProgressField } from '@/core/work-item/details/WorkItemDetailsProgressField';
import { Timeline } from '@/base/timeline/api/Timeline';
import { Temporal } from 'temporal-polyfill';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { CircularProgress } from '@/primitive/components/customized/CircularProgress';
import { WorkItemModalTrigger } from './WorkItemModalTrigger';
import { InplaceInput } from '@/base/inplace/InplaceInput';
import { Icon } from '@/base/Icon';
import { workItemStatusUIProperties } from '../workItemStatusUIProperties';
import { WorkItemTimeFrameDisplayName } from '@/core/work-item/WorkItemTimeFrameDisplayName';
import { WorkItemTimeFrameDisplayRange } from '@/core/work-item/WorkItemTimeFrameDisplayRange';

export function WorkItemDetails({ workItem }: { workItem: WorkItem }) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const onChangeWorkItemDescription = (newDescription: string) => {
		updateWorkItemMutation.mutate({
			context: workItem.contextYear,
			request: {
				updates: {
					[workItem.id]: {
						description: newDescription
					}
				}
			}
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<FieldGroup className="md:flex-row whitespace-nowrap [&_.group\/item]:flex-nowrap">
				<WorkItemDetailsTimeFrameField workItem={workItem} />
				<WorkItemDetailsStatusField workItem={workItem} />
				<WorkItemDetailsProgressField workItem={workItem} />
			</FieldGroup>

			<Timeline startDate={Temporal.PlainDate.from({ year: 2026, month: 1, day: 1 })}
					  endDate={Temporal.PlainDate.from({ year: 2026, month: 12, day: 31 })}
					  deepHierarchyItems={Array.from({ length: 5 }, () => workItem).map(wi => ({
						  id: wi.id,
						  data: wi,
						  dates: wi.timeFrame ? { from: wi.timeFrame.startDate, to: wi.timeFrame.endDate } : undefined,
						  children: [{
							  id: wi.id,
							  data: wi,
							  dates: wi.timeFrame ? { from: wi.timeFrame.startDate.add({ days: 2}), to: wi.timeFrame.endDate } : undefined,
						  }]
					  }))}
					  renderCell={(wi) => (
						  <div className="flex flex-row gap-2 flex-nowrap p-1">
							  <Item size="xs" className="p-0 text-nowrap flex-nowrap overflow-hidden">
								  <ItemMedia>
									  <CircularProgress size="default" values={[{
										  value: wi.progress.completed,
										  strokeClass: 'stroke-green-700 dark:stroke-green-400'
									  }, { value: wi.progress.failed, strokeClass: 'stroke-destructive' }]}>
									  	<WorkItemModalTrigger context={wi.contextYear} workItem={wi} variant="ghost" size="icon-xs" />
									  </CircularProgress>
								  </ItemMedia>
								  <ItemContent>
									  <ItemTitle className='text-xs'><InplaceInput value={wi.title} /></ItemTitle>
									  <ItemDescription className="flex flex-row gap-1 text-xs">
										  <Icon Icon={workItemStatusUIProperties[wi.status].icon}
												className={workItemStatusUIProperties[wi.status].iconTextClass + ' w-4 h-4'} />
										  {workItemStatusUIProperties[wi.status].label}
									  </ItemDescription>
								  </ItemContent>
							  </Item>
							  <Item size="xs" className="p-0 pl-2 flex-0 text-nowrap" asChild>
								  <button>
									  <ItemContent>
										  <ItemTitle className="w-full justify-end text-xs"><WorkItemTimeFrameDisplayRange workItem={wi} /></ItemTitle>
										  <ItemDescription className="text-end text-xs">
											  <WorkItemTimeFrameDisplayName workItem={wi} />
										  </ItemDescription>
									  </ItemContent>
								  </button>
							  </Item>
						  </div>
					  )}
			/>

			<RichTextEditor content={workItem.description}
							placeholder="Description"
							onChangeThrottle={onChangeWorkItemDescription} />
		</div>
	);
}