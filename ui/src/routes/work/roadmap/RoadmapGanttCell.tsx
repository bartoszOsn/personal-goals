import { WorkItem, WorkItemStatus } from '@/models/WorkItem.ts';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/primitive/components/ui/select';
import { Spinner } from '@/primitive/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';

export function RoadmapGanttCell({workItem}: { workItem: WorkItem }) {
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

	const statuses = Object.keys(workItemStatusUIProperties) as WorkItemStatus[];
	const updateStatus = (newStatus: WorkItemStatus) => {
		updateWorkItemMutation.mutate({
			context: workItem.contextYear,
			request: {
				updates: {
					[workItem.id]: {
						status: newStatus
					}
				}
			}
		})
	}

	return (
		<div className="flex flex-row gap-2 flex-nowrap p-1">
			<Item size="xs" className="p-0 text-nowrap flex-nowrap overflow-clip min-w-0">
				<ItemMedia>
					<CircularProgress size="default" values={[{
						value: workItem.progress.completed,
						strokeClass: 'stroke-green-700 dark:stroke-green-400'
					}, { value: workItem.progress.failed, strokeClass: 'stroke-destructive' }]}>
						<WorkItemModalTrigger context={workItem.contextYear} workItem={workItem} variant="ghost" size="icon-xs" />
					</CircularProgress>
				</ItemMedia>
				<ItemContent className='min-w-0 gap-0.5!'>
					<Tooltip>
						<TooltipTrigger asChild>
							<ItemTitle className="text-xs overflow-clip max-w-full">
								<InplaceInput value={workItem.title} onSubmit={(newName) => {
									if (newName.trim() === '') {
										return;
									}

									return updateWorkItemMutation.mutateAsync({
										context: workItem.contextYear,
										request: {
											updates: {
												[workItem.id]: {
													title: newName
												}
											}
										}
									}).then();
								}} className='overflow-hidden text-ellipsis' />
							</ItemTitle>
						</TooltipTrigger>
						<TooltipContent>
							{workItem.title}
						</TooltipContent>
					</Tooltip>

					<Select value={workItem.status} onValueChange={(value) => updateStatus(value as WorkItemStatus)}>
						<SelectTrigger className='py-0 px-0.5 h-[unset]! border-none hover:bg-accent'>
							<ItemDescription className="flex flex-row gap-1 text-xs">
								{
									updateWorkItemMutation.isPending && updateWorkItemMutation.variables?.request?.updates?.[workItem.id]?.status !== undefined
										? <Spinner />
										: <Icon Icon={workItemStatusUIProperties[workItem.status].icon}
												className={workItemStatusUIProperties[workItem.status].iconTextClass + ' w-4 h-4'} />
								}
								{workItemStatusUIProperties[workItem.status].label}
							</ItemDescription>
						</SelectTrigger>
						<SelectContent position='popper'>
							<SelectGroup>
								{
									statuses.map((status) => (
										<SelectItem value={status} key={status}>
											<Icon Icon={workItemStatusUIProperties[status].icon} className={workItemStatusUIProperties[status].iconTextClass} />
											{workItemStatusUIProperties[status].label}
										</SelectItem>
									))
								}
							</SelectGroup>
						</SelectContent>
					</Select>
				</ItemContent>
			</Item>
			<WorkItemTimeFramePicker workItem={workItem}>
				<Item size="xs" className="p-0 pl-2 pr-0.5 flex-0 text-nowrap" asChild>
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