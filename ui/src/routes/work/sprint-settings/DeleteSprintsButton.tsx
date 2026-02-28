import { Button } from '@mantine/core';
import { useDeleteSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintId } from '@/models/Sprint';

export function DeleteSprintsButton(props: { sprintIds: SprintId[] }) {
	const mutation = useDeleteSprintsMutation();

	return <Button color="red"
				   disabled={props.sprintIds.length === 0}
				   loading={mutation.isPending}
				   onClick={() => mutation.mutate(props.sprintIds)}>
		Delete
	</Button>
}