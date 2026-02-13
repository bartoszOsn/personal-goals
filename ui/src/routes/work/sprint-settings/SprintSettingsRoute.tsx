import { Group, Stack } from '@mantine/core';
import { Gantt, type GanttItem } from '@/base/gantt';
import { useSprintQuery } from '@/api/sprint-hooks';
import type { SprintDTO } from '@personal-okr/shared';
import { CreateSprintsButtton } from '@/routes/work/sprint-settings/CreateSprintsButtton';
import { quarterToColor } from '@/core/quarterToColor';
import { getSprintName } from '@/core/getSprintName';
import { useState } from 'react';
import { DeleteSprintsButton } from '@/routes/work/sprint-settings/DeleteSprintsButton';

export function SprintSettingsRoute() {
	const sprints = useSprintQuery();

	const ganttItems: GanttItem<SprintDTO>[] = !sprints.data ? [] : sprints.data.sprints.map(sprint => ({
		id: sprint.id,
		name: getSprintName(sprint),
		color: quarterToColor[sprint.quarter],
		start: new Date(sprint.startDate),
		end: new Date(sprint.endDate),
		data: sprint,
		linksInto: []
	}));

	const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

	return (
		<Stack w="100%" h="100vh" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				<CreateSprintsButtton />
				<DeleteSprintsButton sprintIds={selectedItemIds} />
			</Group>
			{
				sprints.isLoading && <div>Loading...</div>
			}
			{
				ganttItems.length > 0 && <Gantt items={ganttItems}
												containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }}
												selectedItemIds={selectedItemIds}
												setSelectedItemIds={setSelectedItemIds}
				/>
			}
		</Stack>
	);
}