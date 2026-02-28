import { Group, Stack } from '@mantine/core';
import { Gantt, GanttItem } from '@/base/gantt';
import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint-hooks';
import { SprintChangeOverlapFailureDTO, SprintChangeRequestDTO, SprintDTO } from '@personal-okr/shared';
import { CreateSprintsButtton } from '@/routes/work/sprint-settings/CreateSprintsButtton';
import { quarterToColor } from '@/core/quarterToColor';
import { getSprintName } from '@/core/getSprintName';
import { useState } from 'react';
import { DeleteSprintsButton } from '@/routes/work/sprint-settings/DeleteSprintsButton';
import { Temporal } from 'temporal-polyfill';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';
import { ColumnDescriptor } from '@/base/data-table';
import { stringDataType } from '@/base/data-type';
import { plainDateDataType } from '@/base/data-type/data-types/plainDateDataType';

export function SprintSettingsRoute() {
	const sprints = useSprintQuery();
	const updateSprints = useUpdateSprintsMutation();

	const ganttItems: GanttItem<SprintDTO>[] = !sprints.data ? [] : sprints.data.sprints.map(sprint => ({
		id: sprint.id,
		color: quarterToColor[sprint.quarter],
		start: Temporal.PlainDate.from(sprint.startDate),
		end: Temporal.PlainDate.from(sprint.endDate),
		data: sprint,
		linksInto: [],
		children: []
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

	const possibleColumns: ColumnDescriptor<GanttItem<SprintDTO>, any>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			select: (sprint: GanttItem<SprintDTO>) => getSprintName(sprint.data),
			columnType: stringDataType
		},
		{
			columnId: 'startDate',
			columnName: 'Start date',
			select: (sprint: GanttItem<SprintDTO>) => Temporal.PlainDate.from(sprint.data.startDate),
			columnType: plainDateDataType,
			onChange: async (sprintItem, newDate) => {
				const request: SprintChangeRequestDTO = {
					[sprintItem.id]: {
						newStartDate: newDate.toString(),
						newEndDate: sprintItem.end!.toString()
					}
				}

				await updateSprints.mutateAsync(request)
			}
		},
		{
			columnId: 'endDate',
			columnName: 'End date',
			select: (sprint: GanttItem<SprintDTO>) => Temporal.PlainDate.from(sprint.data.endDate),
			columnType: plainDateDataType,
			onChange: async (sprintItem, newDate) => {
				const request: SprintChangeRequestDTO = {
					[sprintItem.id]: {
						newStartDate: sprintItem.start!.toString(),
						newEndDate: newDate.toString()
					}
				}

				await updateSprints.mutateAsync(request)
			}
		}
	]

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
												setSelectedItemIds={setSelectedItemIds}
												changeDates={changeDates}
												ganttKey={'sprint-settings'}
												possibleColumns={possibleColumns}
												initialColumnIds={['name', 'startDate', 'endDate']}
				/>
			}
		</Stack>
	);
}