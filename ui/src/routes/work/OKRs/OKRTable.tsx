import { ActionIcon, Box, Button, Center, Collapse, Group, Modal, RingProgress, Stack, Text, TextInput } from '@mantine/core';
import { useKeyResultCreateMutation, useKeyResultDeleteMutation, useOkrDeleteMutation } from '@/api/okr/okr-hooks';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconClock, IconPercentage, IconTrash } from '@tabler/icons-react';
import { Objective } from '@/models/Objective';

export interface OKRTableProps {
	objective: Objective;
}

export function OkRTable({ objective }: OKRTableProps) {
	const createKRMutation = useKeyResultCreateMutation();
	const deleteOkrMutation = useOkrDeleteMutation();
	const deleteKeyResultMutation = useKeyResultDeleteMutation();
	const [opened, { open, close }] = useDisclosure(false);
	const [name, setName] = useState<string>();
	const [collapsed, { toggle: toggleCollapse }] = useDisclosure(false);
	const submit = () => {
		createKRMutation.mutateAsync({ objectiveId: objective.id, request: { name } })
			.then(() => close());
	};

	return (
		<Stack gap="xs">
			<Modal opened={opened} onClose={close} title="Create key result">
				<Stack>
					<TextInput
						label="Name"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
					<Button onClick={submit} loading={createKRMutation.isPending}>Create</Button>
				</Stack>
			</Modal>
			<Box bg="blue.1"
				 style={{ borderLeft: 'solid 2px var(--mantine-color-blue-5)' }}
				 px="sm"
				 py="xs">
				<Group wrap="nowrap">
					<Button size="compact-md" variant="subtle" px={2} onClick={toggleCollapse}>
						{
							collapsed ? <IconChevronDown /> : <IconChevronUp />
						}
					</Button>
					<Text style={{ textWrap: 'nowrap' }} c="blue" fw="bold" size="lg">O:</Text>
					<Box flex={1}>
						<Text>{objective.name}</Text>
					</Box>
					<RingProgress sections={[{ value: 40, color: 'blue' }]} size={40} thickness={4} label={(
						<Center>
							<IconClock size={12} />
						</Center>
					)} />
					<RingProgress sections={[{ value: 60, color: 'blue' }]} size={40} thickness={4} label={(
						<Center>
							<IconPercentage size={12} />
						</Center>
					)} />
					<ActionIcon color="red"
								variant="subtle"
								size="sm"
								onClick={() => deleteOkrMutation.mutateAsync(objective.id)}
								loading={deleteOkrMutation.isPending}>
						<IconTrash size={12} />
					</ActionIcon>
				</Group>
			</Box>
			<Collapse in={!collapsed}>
				<Stack gap="xs" ml="xl">
					{
						objective.KeyResults.map((keyResult, index) => (
							<Box bg="orange.1" pl="lg" pr='sm' py="xs" style={{ borderLeft: 'solid 2px var(--mantine-color-orange-5)' }}>
								<Group wrap="nowrap">
									<Text style={{ textWrap: 'nowrap' }} c="orange" fw="bold" size="lg">KR-{index + 1}:</Text>
									<Box flex={1}>
										<Text size="sm">{keyResult.name}</Text>
									</Box>
									<RingProgress sections={[{ value: 60, color: 'orange' }]} size={40} thickness={4} label={(
										<Center>
											<IconPercentage size={12} />
										</Center>
									)} />
									<ActionIcon color="red"
												variant="subtle"
												size="sm"
												onClick={() => deleteKeyResultMutation.mutateAsync(keyResult.id)}
												loading={deleteKeyResultMutation.isPending}>
										<IconTrash size={12} />
									</ActionIcon>
								</Group>
							</Box>
						))
					}
					<Button color="gray" variant="light" h="unset" p="md" onClick={open}>
						<Text size="sm">+ Add Key result</Text>
					</Button>
				</Stack>
			</Collapse>
		</Stack>
	);
}