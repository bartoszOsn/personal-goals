import { WorkItem } from '@/models/WorkItem.ts';
import { CircularProgress } from '@/primitive/components/customized/CircularProgress';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { WorkItemModalTrigger } from '@/core/work-item/details/WorkItemModalTrigger.tsx';
import { InplaceInput } from '@/base/inplace/InplaceInput';
import { Icon } from '@/base/Icon.tsx';
import { workItemStatusUIProperties } from '@/core/work-item/workItemStatusUIProperties.ts';
import { WorkItemTimeFrameDisplayRange } from '@/core/work-item/WorkItemTimeFrameDisplayRange.tsx';
import { WorkItemTimeFrameDisplayName } from '@/core/work-item/WorkItemTimeFrameDisplayName.tsx';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { WorkItemTimeFramePicker } from '@/core/work-item/WorkItemTimeFramePicker';

export function RoadmapGanttCell({workItem}: { workItem: WorkItem }) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

	return (
		<div className="flex flex-row gap-2 flex-nowrap p-1">
			<Item size="xs" className="p-0 text-nowrap flex-nowrap overflow-hidden">
				<ItemMedia>
					<CircularProgress size="default" values={[{
						value: workItem.progress.completed,
						strokeClass: 'stroke-green-700 dark:stroke-green-400'
					}, { value: workItem.progress.failed, strokeClass: 'stroke-destructive' }]}>
						<WorkItemModalTrigger context={workItem.contextYear} workItem={workItem} variant="ghost" size="icon-xs" />
					</CircularProgress>
				</ItemMedia>
				<ItemContent>
					<ItemTitle className="text-xs overflow-clip max-w-full">
						<InplaceInput value={workItem.title} onSubmit={(newName) => updateWorkItemMutation.mutateAsync({
							context: workItem.contextYear,
							request: {
								updates: {
									[workItem.id]: {
										title: newName
									}
								}
							}
						}).then()} />
					</ItemTitle>
					<ItemDescription className="flex flex-row gap-1 text-xs">
						<Icon Icon={workItemStatusUIProperties[workItem.status].icon}
							  className={workItemStatusUIProperties[workItem.status].iconTextClass + ' w-4 h-4'} />
						{workItemStatusUIProperties[workItem.status].label}
					</ItemDescription>
				</ItemContent>
			</Item>
			<WorkItemTimeFramePicker workItem={workItem}>
				<Item size="xs" className="p-0 pl-2 flex-0 text-nowrap" asChild>
					<button>
						<ItemContent>
							<ItemTitle className="w-full justify-end text-xs">
								<WorkItemTimeFrameDisplayRange workItem={workItem} />
							</ItemTitle>
							<ItemDescription className="text-end text-xs">
								<WorkItemTimeFrameDisplayName workItem={workItem} />
							</ItemDescription>
						</ItemContent>
					</button>
				</Item>
			</WorkItemTimeFramePicker>
		</div>
	)
}