import { Button, List, Modal, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCreateSprintsMutation } from '@/api/sprint-hooks';
import { useState } from 'react';
import type { SprintBulkCreateRequestDTO, SprintCreateOverlapFailureDTO } from '@personal-okr/shared';
import { DateInput } from '@mantine/dates';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';
import { getSprintName } from '@/core/getSprintName';

export function CreateSprintsButtton() {
	const [opened, { open, close }] = useDisclosure(false);
	const mutation = useCreateSprintsMutation();
	const [startDate, setStartDate] = useState(new Date());
	const [numberOfSprints, setNumberOfSprints] = useState(1);
	const [sprintDuration, setSprintDuration] = useState<SprintBulkCreateRequestDTO['sprintDuration']>('two-weeks');

	const request: SprintBulkCreateRequestDTO = {
		startDate: startDate.toISOString(),
		numberOfSprints,
		sprintDuration,
	};

	const submit = () => {
		mutation.mutateAsync(request)
			.then(() => close())
			.catch(err => {
				if (HttpError.is<SprintCreateOverlapFailureDTO>(err, 409)) {
					notifications.show({
						title: 'Sprint overlap detected',
						message: (
							<>
								<Text>Could not create sprints due to overlap with an existing sprint(s):</Text>
								<List>
									{err.data.conflictingSprings.sprints.map(sprint => (
										<List.Item key={sprint.id}>{getSprintName(sprint)}</List.Item>
									))}
								</List>
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
		<>
			<Modal opened={opened} onClose={close} title="Create sprints">
				<Stack>
					<DateInput
						label="Start date"
						value={startDate}
						onChange={(e) => e && setStartDate(new Date(e))}
					/>
					<NumberInput
						label="Number of sprints"
						value={numberOfSprints}
						onChange={(value) => setNumberOfSprints(+value)}
					/>
					<Select
						label="Sprint duration"
						data={[
							{ value: 'week', label: 'Week' },
							{ value: 'two-weeks', label: 'Two weeks' },
							{ value: 'month', label: 'Month' },
						]}
						value={sprintDuration}
						onChange={value => value && setSprintDuration(value as SprintBulkCreateRequestDTO['sprintDuration'])}
					/>
					<Button onClick={submit} loading={mutation.isPending}>Create sprints</Button>
				</Stack>
			</Modal>
			<Button onClick={open}>Create sprints</Button>
		</>
	)
}