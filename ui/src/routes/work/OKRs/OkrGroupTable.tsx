import type { ObjectiveDeadlineDTO, ObjectiveDTO } from '@personal-okr/shared';
import { ActionIcon, Group, Stack, Text } from '@mantine/core';
import { CreateObjectiveModal } from '@/routes/work/OKRs/CreateObjectiveModal';
import { quarterToColor } from '@/core/quarterToColor';
import { OkRTable } from '@/routes/work/OKRs/OKRTable';

export interface OkrGroupTableProps {
	objectives: ObjectiveDTO[];
	deadline: ObjectiveDeadlineDTO;
}

export function OkrGroupTable(props: OkrGroupTableProps) {
	const { objectives, deadline } = props;

	if (objectives.length === 0) {
		return null;
	}

	return (
		<Stack gap='lg'>
			<Group gap='xs' c={deadline.quarter ? quarterToColor[deadline.quarter] : undefined}>
				<Text fw='500'>{deadline.quarter ?? 'Global'}</Text>
				<CreateObjectiveModal initialDeadline={deadline}>
					{
						open => <ActionIcon size='sm' variant="subtle" onClick={open}>+</ActionIcon>
					}
				</CreateObjectiveModal>
			</Group>
			{objectives.map((objective) => (
				<OkRTable key={objective.id} objective={objective} />
			))}
		</Stack>
	);
}