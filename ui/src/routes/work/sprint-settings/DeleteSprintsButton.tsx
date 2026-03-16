import { Button } from '@mantine/core';
import { useDeleteSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintId } from '@/models/Sprint';
import { IconTrash } from '@tabler/icons-react';

export function DeleteSprintsButton(props: { context: number, sprintIds: SprintId[] }) {
	const mutation = useDeleteSprintsMutation(props.context);

	return <Button size='xs'
				   variant='outline'
				   color="red"
				   leftSection={<IconTrash size={14} />}
				   disabled={props.sprintIds.length === 0}
				   loading={mutation.isPending}
				   onClick={() => mutation.mutate(props.sprintIds)}>
		Delete
	</Button>
}