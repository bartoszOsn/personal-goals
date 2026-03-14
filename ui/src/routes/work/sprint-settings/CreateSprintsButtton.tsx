import { Button, Text } from '@mantine/core';
import { useCreateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintCreateOverlapFailureDTO } from '@personal-okr/shared';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';

export function CreateSprintsButtton({ context }: { context: number }) {
	const mutation = useCreateSprintsMutation(context);

	const submit = () => {
		mutation.mutateAsync()
			.catch(err => {
				if (HttpError.is<SprintCreateOverlapFailureDTO>(err, 409)) {
					notifications.show({
						title: 'Sprint overlap detected',
						message: (
							<>
								<Text>Could not create sprints due to overlap with an existing sprint(s)</Text>
							</>
						),
						color: 'red'
					})
				} else {
					throw err;
				}
			});
	}
	return (
		<Button onClick={submit}>Create sprints</Button>
	)
}