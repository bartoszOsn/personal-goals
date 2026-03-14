import { Button, List, Modal, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCreateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { useState } from 'react';
import { SprintCreateOverlapFailureDTO } from '@personal-okr/shared';
import { DateInput } from '@mantine/dates';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';
import { Temporal } from 'temporal-polyfill';
import { SprintBulkCreateRequest, SprintDuration } from '@/models/Sprint';
import { dtoToSprint } from '@/api/sprint/sprint-converters';

export function CreateSprintsButtton() {
	const [opened, { open, close }] = useDisclosure(false);
	const mutation = useCreateSprintsMutation();
	const [startDate, setStartDate] = useState(Temporal.Now.plainDateISO());
	const [numberOfSprints, setNumberOfSprints] = useState(1);
	const [sprintDuration, setSprintDuration] = useState<SprintDuration>(SprintDuration.TWO_WEEKS);

	const request: SprintBulkCreateRequest = {
		startDate: startDate,
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
										<List.Item key={sprint.id}>{dtoToSprint(sprint).name}</List.Item>
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
						value={startDate.toString()}
						onChange={(e) => e && setStartDate(Temporal.PlainDate.from(e))}
					/>
					<NumberInput
						label="Number of sprints"
						value={numberOfSprints}
						onChange={(value) => setNumberOfSprints(+value)}
					/>
					<Select
						label="Sprint duration"
						data={[
							{ value: SprintDuration.WEEK, label: 'Week' },
							{ value: SprintDuration.TWO_WEEKS, label: 'Two weeks' },
							{ value: SprintDuration.MONTH, label: 'Month' },
						]}
						value={sprintDuration}
						onChange={value => value && setSprintDuration(value as SprintDuration)}
					/>
					<Button onClick={submit} loading={mutation.isPending}>Create sprints</Button>
				</Stack>
			</Modal>
			<Button onClick={open}>Create sprints</Button>
		</>
	)
}