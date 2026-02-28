import { ColumnDescriptor } from '@/base/data-table';
import { Gantt, GanttItem } from '@/base/gantt';
import { Group, Stack, Text } from '@mantine/core';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { KeyResultDTO, ObjectiveDTO } from '@personal-okr/shared';
import { Task } from '@/models/Task';

export function RoadmapRoute() {
	const {loading, ganttItems} = useRoadmapGanttItems();

	const columns: ColumnDescriptor<GanttItem<ObjectiveDTO | KeyResultDTO | Task>, string>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			hierarchyColumn: true,
			render: (item) => <Text inherit>{item.data.name}</Text>
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
