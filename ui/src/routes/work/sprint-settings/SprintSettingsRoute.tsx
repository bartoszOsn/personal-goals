import { Group, Stack, Text } from '@mantine/core';
import { Gantt, GanttItem } from '@/base/gantt';
import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { SprintChangeOverlapFailureDTO } from '@personal-okr/shared';
import { CreateSprintsButtton } from '@/routes/work/sprint-settings/CreateSprintsButtton';
import { quarterToColor } from '@/core/quarterToColor';
import { getSprintName } from '@/core/getSprintName';
import { useState } from 'react';
import { DeleteSprintsButton } from '@/routes/work/sprint-settings/DeleteSprintsButton';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { HttpError } from '@/base/http';
import { notifications } from '@mantine/notifications';
import { ColumnDescriptor } from '@/base/data-table';
import { Sprint, SprintChangeRequest, SprintId } from '@/models/Sprint';
import { SprintStartDateInplace } from '@/core/sprint/inplace/SprintStartDateInplace';
import { SprintEndDateInplace } from '@/core/sprint/inplace/SprintEndDateInplace';

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

	const possibleColumns: ColumnDescriptor<GanttItem<Sprint>>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			render: (sprint) => <Text inherit>{getSprintName(sprint.data)}</Text>
		},
		{
			columnId: 'startDate',
			columnName: 'Start date',
			render: (sprint) => <SprintStartDateInplace sprint={sprint.data} />
		},
		{
			columnId: 'endDate',
			columnName: 'End date',
			render: (sprint) => <SprintEndDateInplace sprint={sprint.data} />
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