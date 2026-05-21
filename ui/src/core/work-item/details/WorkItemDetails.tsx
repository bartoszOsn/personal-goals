import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { WorkItem } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { FieldGroup } from '@/primitive/components/ui/field';
import { WorkItemDetailsTimeFrameField } from '@/core/work-item/details/WorkItemDetailsTimeFrameField';
import { WorkItemDetailsStatusField } from '@/core/work-item/details/WorkItemDetailsStatusField';
import { WorkItemDetailsProgressField } from '@/core/work-item/details/WorkItemDetailsProgressField';
import { Timeline } from '@/base/timeline/api/Timeline';
import { Temporal } from 'temporal-polyfill';
import { TimelineRow } from '@/base/timeline/api/TimelineRow';
import { TimelineRowCell } from '@/base/timeline/api/TimelineRowCell';
import { TimelineRowChart } from '@/base/timeline/api/TimelineRowChart';
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

			<Timeline startDate={Temporal.PlainDate.from({ year: 2026, month: 1, day: 1})} endDate={Temporal.PlainDate.from({ year: 2026, month: 12, day: 31})}>
				{
					Array.from({ length: 10 }, () => workItem).map((_, i) => (
						<TimelineRow key={i}>
							<TimelineRowCell>
								<div className='flex flex-row gap-2 flex-nowrap p-1'>
									<Item size='sm' className='p-0 text-nowrap flex-nowrap overflow-hidden'>
										<ItemMedia>
											<CircularProgress size='default' values={[{ value: workItem.progress.completed, strokeClass: 'stroke-green-700 dark:stroke-green-400' }, { value: workItem.progress.failed, strokeClass: 'stroke-destructive' }]} />
											<WorkItemModalTrigger context={workItem.contextYear} workItem={workItem} variant='ghost' size='icon-xs' />
										</ItemMedia>
										<ItemContent>
											<ItemTitle><InplaceInput value={workItem.title} /></ItemTitle>
											<ItemDescription className='flex flex-row gap-1'>
												<Icon Icon={ workItemStatusUIProperties[workItem.status].icon } className={workItemStatusUIProperties[workItem.status].iconTextClass + ' w-5 h-5'} />
												{ workItemStatusUIProperties[workItem.status].label }
											</ItemDescription>
										</ItemContent>
									</Item>
									<Item size='sm' className='p-0 pl-2 flex-0 text-nowrap' asChild>
										<button>
											<ItemContent>
												<ItemTitle className='w-full justify-end'><WorkItemTimeFrameDisplayRange workItem={workItem} /></ItemTitle>
												<ItemDescription className='text-end'>
													<WorkItemTimeFrameDisplayName workItem={workItem} />
												</ItemDescription>
											</ItemContent>
										</button>
									</Item>
								</div>
							</TimelineRowCell>
							<TimelineRowChart>
								<div className='w-16 h-6 bg-background border rounded my-1 absolute left-12'></div>
							</TimelineRowChart>
						</TimelineRow>
					))
				}
			</Timeline>

			<RichTextEditor content={workItem.description}
							placeholder="Description"
							onChangeThrottle={onChangeWorkItemDescription} />
		</div>
	);
}