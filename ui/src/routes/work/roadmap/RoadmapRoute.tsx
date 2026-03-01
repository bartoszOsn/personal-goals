import { ColumnDescriptor } from '@/base/data-table';
import { Gantt, GanttItem } from '@/base/gantt';
import { Group, Stack } from '@mantine/core';
import { useRoadmapGanttItems } from '@/routes/work/roadmap/useRoadmapGanttItems';
import { mapColumnData } from '@/base/data-table/api/mapColumnData';
import { WorkItemVariant } from '@/models/WorkItemVariant';
import { taskColumns, workItemCommonColumns } from '@/core/columns';

export function RoadmapRoute() {
	const {loading, ganttItems} = useRoadmapGanttItems();

	const columns: ColumnDescriptor<GanttItem<WorkItemVariant>>[] = mapColumnData(
		(item: GanttItem<WorkItemVariant>) => item.data,
		[
			...workItemCommonColumns,
			...taskColumns
		]
	);

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
