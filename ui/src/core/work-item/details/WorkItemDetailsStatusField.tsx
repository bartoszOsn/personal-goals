import { WorkItem, WorkItemStatus } from '@/models/WorkItem.ts';
import { Field, FieldLabel } from '@/primitive/components/ui/field.tsx';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/primitive/components/ui/item.tsx';
import { Icon } from '@/base/Icon.tsx';
import { workItemStatusUIProperties } from '@/core/work-item/workItemStatusUIProperties.ts';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@/primitive/components/ui/select';
import { Spinner } from '@/primitive/components/ui/spinner';

export function WorkItemDetailsStatusField({ workItem }: { workItem: WorkItem }) {
	const statuses = Object.keys(workItemStatusUIProperties) as WorkItemStatus[];
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();

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
		<Field>
			<FieldLabel>Status</FieldLabel>
			<Select value={workItem.status} onValueChange={(value) => updateStatus(value as WorkItemStatus)}>
				<Item variant="outline" className="flex-1" asChild>
					<SelectTrigger>
						<ItemMedia>
							{
								updateWorkItemMutation.isPending
									? <Spinner />
									: <Icon Icon={workItemStatusUIProperties[workItem.status].icon} className={workItemStatusUIProperties[workItem.status].iconTextClass} />
							}
						</ItemMedia>
						<ItemContent>
							<ItemTitle>{workItemStatusUIProperties[workItem.status].label}</ItemTitle>
						</ItemContent>
					</SelectTrigger>
				</Item>
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
		</Field>
	)
}