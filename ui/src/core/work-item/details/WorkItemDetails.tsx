import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { WorkItem } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { FieldGroup } from '@/primitive/components/ui/field';
import { WorkItemDetailsTimeFrameField } from '@/core/work-item/details/WorkItemDetailsTimeFrameField';
import { WorkItemDetailsStatusField } from '@/core/work-item/details/WorkItemDetailsStatusField';
import { WorkItemDetailsProgressField } from '@/core/work-item/details/WorkItemDetailsProgressField';

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

			<RichTextEditor content={workItem.description}
							placeholder="Description"
							onChangeThrottle={onChangeWorkItemDescription} />
		</div>
	);
}