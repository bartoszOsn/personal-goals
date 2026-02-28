import { Group, Stack } from '@mantine/core';
import { Gantt, GanttItem } from '@/base/gantt';
import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintChangeOverlapFailureDTO } from '@personal-okr/shared';
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
import { Sprint, SprintChangeRequest, SprintId } from '@/models/Sprint';

export function SprintSettingsRoute() {
	const sprints = useSprintQuery();
	const updateSprints = useUpdateSprintsMutation();

	const ganttItems: GanttItem<Sprint>[] = !sprints.data ? [] : sprints.data.map(sprint => ({
		id: sprint.id,
		color: quarterToColor[sprint.quarter],
		start: sprint.startDate,
		end: sprint.endDate,
		data: sprint,
		linksInto: [],
		children: []
	}));

	const [selectedItemIds, setSelectedItemIds] = useState<SprintId[]>([]);

	const changeDates = async (items: Map<string, GanttNewItemDates>) => {
		const request: SprintChangeRequest = Object.fromEntries(
			[...items.entries()].map(([id, dates]) => [id, { newStartDate: dates.startDate, newEndDate: dates.endDate }])
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

	const possibleColumns: ColumnDescriptor<GanttItem<Sprint>, any>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			select: (sprint: GanttItem<Sprint>) => getSprintName(sprint.data),
			columnType: stringDataType
		},
		{
			columnId: 'startDate',
			columnName: 'Start date',
			select: (sprint: GanttItem<Sprint>) => Temporal.PlainDate.from(sprint.data.startDate),
			columnType: plainDateDataType,
			onChange: async (sprintItem, newDate) => {
				const request: SprintChangeRequest = {
					[sprintItem.id]: {
						newStartDate: newDate,
						newEndDate: sprintItem.end!
					}
				}

				await updateSprints.mutateAsync(request)
			}
		},
		{
			columnId: 'endDate',
			columnName: 'End date',
			select: (sprint: GanttItem<Sprint>) => Temporal.PlainDate.from(sprint.data.endDate),
			columnType: plainDateDataType,
			onChange: async (sprintItem, newDate) => {
				const request: SprintChangeRequest = {
					[sprintItem.id]: {
						newStartDate: sprintItem.start!,
						newEndDate: newDate
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
												setSelectedItemIds={(ids) => setSelectedItemIds(ids as SprintId[])}
												changeDates={changeDates}
												ganttKey={'sprint-settings'}
												possibleColumns={possibleColumns}
												initialColumnIds={['name', 'startDate', 'endDate']}
				/>
			}
		</Stack>
	);
}