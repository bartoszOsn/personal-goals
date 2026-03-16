import { Button } from '@mantine/core';
import { useFillSprintsMutation } from '@/api/sprint/sprint-hooks';
import { IconCalendarPlus } from '@tabler/icons-react';

export function FillSprintsButton({ context }: { context: number }) {
	const mutation = useFillSprintsMutation(context);

	const submit = () => {
		mutation.mutate();
	}
	return (
		<Button size="xs"
				variant="outline"
				leftSection={<IconCalendarPlus size={14} />}
				onClick={submit}>Fill</Button>
	)
}