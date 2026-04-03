import { Group, Stack, Text } from '@mantine/core';
import { WorkItemTimeFrameInplace } from '@/core/work-item/inplace/WorkItemTimeFrameInplace.tsx';
import { WorkItemStatusInplace } from '@/core/work-item/inplace/WorkItemStatusInplace.tsx';
import { WorkItemProgressInplace } from '@/core/work-item/inplace/WorkItemProgressInplace.tsx';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { WorkItem } from '@/models/WorkItem';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';

export function WorkItemDetails({ workItem }: { workItem: WorkItem}) {
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
	}

	return (
		<Stack gap='xl'>
			<Group gap="xl" align="stretch">
				<Stack gap="xs" justify='space-between'>
					<Text size="sm" c="dimmed">Time frame</Text>
					<WorkItemTimeFrameInplace workItem={workItem} />
				</Stack>
				<Stack gap="xs" justify='space-between'>
					<Text size="sm" c="dimmed">Status</Text>
					<WorkItemStatusInplace workItem={workItem} />
				</Stack>
				<Stack gap="xs" justify='space-between' miw={128}>
					<Text size="sm" c="dimmed">Progress</Text>
					<WorkItemProgressInplace workItem={workItem} />
				</Stack>
			</Group>

			<RichTextEditor content={workItem.description}
							placeholder="Description"
							onChangeThrottle={onChangeWorkItemDescription} />
		</Stack>
	)
}