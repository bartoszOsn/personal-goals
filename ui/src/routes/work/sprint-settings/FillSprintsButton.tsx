import { Button } from '@mantine/core';
import { useFillSprintsMutation } from '@/api/sprint/sprint-hooks';

export function FillSprintsButton({ context }: { context: number }) {
	const mutation = useFillSprintsMutation(context);

	const submit = () => {
		mutation.mutate();
	}
	return (
		<Button onClick={submit}>Fill sprints</Button>
	)
}