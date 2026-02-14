import type { ObjectiveDTO } from '@personal-okr/shared';
import { Box, Button, Center, Collapse, Group, Modal, RingProgress, Stack, Text, TextInput } from '@mantine/core';
import { useKeyResultCreateMutation } from '@/api/okr-hooks';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { IconChevronDown, IconChevronUp, IconClock, IconPercentage } from '@tabler/icons-react';

export interface OKRTableProps {
	objective: ObjectiveDTO;
}

export function OkRTable({ objective }: OKRTableProps) {
	const createKRMutation = useKeyResultCreateMutation();
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
			<Box bg="blue.1" style={{ borderLeft: 'solid 2px var(--mantine-color-blue-5)' }} pr="lg" pl='sm' py="xs">
				<Group wrap="nowrap">
					<Button size='compact-md' variant='subtle' px={2} onClick={toggleCollapse}>
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
				</Group>
			</Box>
			<Collapse in={!collapsed}>
				<Stack gap="xs" ml="xl">
					{
						objective.keyResults.map((keyResult, index) => (
							<Box bg="orange.1" px="lg" py="xs" style={{ borderLeft: 'solid 2px var(--mantine-color-orange-5)' }}>
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