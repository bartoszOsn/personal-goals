import { ColumnDescriptor } from '@/base/data-table';
import { stringDataType } from '@/base/data-type';
import { Gantt, GanttItem } from '@/base/gantt';
import { Group, Stack } from '@mantine/core';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { KeyResultDTO, ObjectiveDTO, TaskDTO } from '@personal-okr/shared';

export function RoadmapRoute() {
	const {loading, ganttItems} = useRoadmapGanttItems();

	const columns: ColumnDescriptor<GanttItem<ObjectiveDTO | KeyResultDTO | TaskDTO>, string>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			select: (row) => {
				return row.data.name
			},
			columnType: stringDataType,
			hierarchyColumn: true,
		}
	];

	return (
		<Stack w="100%" h="100vh" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				Here will be some buttons
			</Group>
			{
				loading && <div>Loading...</div>
			}
			{
				ganttItems.length > 0 && <Gantt items={ganttItems}
												containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }}
												ganttKey={'sprint-settings'}
												possibleColumns={columns}
												initialColumnIds={['name']}
				/>
			}
		</Stack>
	);
}
