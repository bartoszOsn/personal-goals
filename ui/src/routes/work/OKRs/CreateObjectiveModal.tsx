import { ReactNode, useState } from 'react';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ObjectiveDeadlinePicker } from '@/core/ObjectiveDeadlinePicker';
import { useOkrCreateMutation } from '@/api/okr/okr-hooks';
import { ObjectiveDeadline } from '@/models/Objective';

export interface CreateObjectiveModalProps {
	initialDeadline?: ObjectiveDeadline;
	children: (onClick: () => void) => ReactNode;
}

export function CreateObjectiveModal({ initialDeadline, children }: CreateObjectiveModalProps) {
	const mutation = useOkrCreateMutation();
	const [name, setName] = useState('');
	const [deadline, setDeadline] = useState(initialDeadline);
	const [opened, { open, close }] = useDisclosure(false);

	const create = () => {
		mutation.mutateAsync({ name, deadline })
			.then(() => {
				close();
			})
	}

	return (
		<>
			<Modal opened={opened} onClose={close} title="Create objective">
				<Stack>
					<TextInput label="Objective name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
					<ObjectiveDeadlinePicker label='Deadline' value={deadline} onChange={(deadline) => setDeadline(deadline)} />
					<Button onClick={create} disabled={!name || !deadline} loading={mutation.isPending}>Create</Button>
				</Stack>
			</Modal>
			{ children(open) }
		</>
	);
}