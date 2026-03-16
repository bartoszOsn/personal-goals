import { Group, Stack, Text } from '@mantine/core';
import { Gantt, GanttItem } from '@/base/gantt';
import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { CreateSprintsButtton } from '@/routes/work/sprint-settings/CreateSprintsButtton';
import { quarterToColor } from '@/core/quarterToColor';
import { useState } from 'react';
import { DeleteSprintsButton } from '@/routes/work/sprint-settings/DeleteSprintsButton';
import { GanttNewItemDates } from '@/base/gantt/model/GanttNewItemDates';
import { ColumnDescriptor } from '@/base/data-table';
import { Sprint, SprintChangeRequest, SprintId } from '@/models/Sprint';
import { SprintStartDateInplace } from '@/core/sprint/inplace/SprintStartDateInplace';
import { SprintEndDateInplace } from '@/core/sprint/inplace/SprintEndDateInplace';
import { getRouteApi } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { FillSprintsButton } from '@/routes/work/sprint-settings/FillSprintsButton';

export function SprintSettingsRoute() {
	const context = getRouteApi('/work/$context/sprint-settings')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	const sprints = useSprintQuery(context);
	const updateSprints = useUpdateSprintsMutation(context);

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
	}

	const possibleColumns: ColumnDescriptor<GanttItem<Sprint>>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			render: (sprint) => <Text inherit>{sprint.data.name}</Text>
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
		<Stack w="100%" h="calc(100vh - 50px)" gap='xs' p="lg" style={{ overflow: 'hidden' }}>
			<Group gap='xs'>
				<CreateSprintsButtton context={context} />
				<FillSprintsButton context={context} />
				<DeleteSprintsButton context={context} sprintIds={selectedItemIds} />
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