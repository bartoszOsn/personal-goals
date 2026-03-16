import { Button } from '@mantine/core';
import { useCreateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { IconPlus } from '@tabler/icons-react';

export function CreateSprintsButtton({ context }: { context: number }) {
	const mutation = useCreateSprintsMutation(context);

	const submit = () => {
		mutation.mutate();
	}
	return (
		<Button size="xs"
				variant="outline"
				leftSection={<IconPlus size={14} />}
				onClick={submit}>Create</Button>
	)
}