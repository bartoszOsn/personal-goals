import { Group, Stack } from '@mantine/core';
import { Gantt, type GanttItem } from '@/base/gantt';
import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint-hooks';
import type { SprintChangeOverlapFailureDTO, SprintChangeRequestDTO, SprintDTO } from '@personal-okr/shared';
import { CreateSprintsButtton } from '@/routes/work/sprint-settings/CreateSprintsButtton';
import { quarterToColor } from '@/core/quarterToColor';
import { getSprintName } from '@/core/getSprintName';
import { useState } from 'react';
import { DeleteSprintsButton } from '@/routes/work/sprint-settings/DeleteSprintsButton';
import { Temporal } from 'temporal-polyfill';
import type { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';

export function SprintSettingsRoute() {
	const sprints = useSprintQuery();
	const updateSprints = useUpdateSprintsMutation();

	const ganttItems: GanttItem<SprintDTO>[] = !sprints.data ? [] : sprints.data.sprints.map(sprint => ({
		id: sprint.id,
		name: getSprintName(sprint),
		color: quarterToColor[sprint.quarter],
		start: Temporal.PlainDate.from(sprint.startDate),
		end: Temporal.PlainDate.from(sprint.endDate),
		data: sprint,
		linksInto: []
	}));

	const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

	const changeDates = async (items: Map<string, GanttNewItemDates>) => {
		const request: SprintChangeRequestDTO = Object.fromEntries(
			[...items.entries()].map(([id, dates]) => [id, { newStartDate: dates.startDate.toString(), newEndDate: dates.endDate.toString() }])
		);

		await updateSprints.mutateAsync(request)
			.catch(err => {
				if (HttpError.is<SprintChangeOverlapFailureDTO>(err, 409)) {
					notifications.show({
						message: 'Sprint overlap detected. Please resolve conflicts before saving.',
						color: 'red'
					})
				} else {
					throw err;
				}
			})
	}

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
												changeDates={changeDates}
				/>
			}
		</Stack>
	);
}