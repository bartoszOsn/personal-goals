import { Button } from '@mantine/core';
import { useDeleteSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintId } from '@/models/Sprint';
import { usePrevious } from '@mantine/hooks';

export function DeleteSprintsButton(props: { context: number, sprintIds: SprintId[] }) {
	const mutation = useDeleteSprintsMutation(props.context);

	const sprintsIds = usePrevious(props.sprintIds); // TODO fix this. Clicking on delete button unselects table. This is wworkaround that hardly works

	return <Button color="red"
				   disabled={!sprintsIds || sprintsIds.length === 0}
				   loading={mutation.isPending}
				   onClick={() => mutation.mutate(sprintsIds ?? [])}>
		Delete
	</Button>
}