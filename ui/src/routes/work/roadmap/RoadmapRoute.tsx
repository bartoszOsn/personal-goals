import { type ColumnDescriptor } from '@/base/data-table';
import { stringDataType } from '@/base/data-type';
import { Gantt, type GanttItem } from '@/base/gantt';
import { Temporal } from 'temporal-polyfill';

export function RoadmapRoute() {
	const rows: GanttItem<string>[] = [
		{
			id: '1',
			data: 'Standalone 1',
			color: 'gray',
			start: Temporal.PlainDate.from('2025-01-01'),
			end: Temporal.PlainDate.from('2025-01-02'),
			linksInto: [],
			children: []
		},
		{
			id: '3',
			data: 'Root Parent',
			color: 'gray',
			start: Temporal.PlainDate.from('2025-01-05'),
			end: Temporal.PlainDate.from('2025-01-10'),
			linksInto: [],
			children: [
				{
					id: '3.1',
					data: 'Child 1',
					color: 'gray',
					start: Temporal.PlainDate.from('2025-01-06'),
					end: Temporal.PlainDate.from('2025-01-07'),
					linksInto: [],
					children: []
				},
				{
					id: '3.3',
					data: 'Child without start',
					color: 'gray',
					end: Temporal.PlainDate.from('2025-01-07'),
					linksInto: [],
					children: []
				},
				{
					id: '3.4',
					data: 'Child without end',
					color: 'gray',
					start: Temporal.PlainDate.from('2025-01-07'),
					linksInto: [],
					children: []
				},
				{
					id: '3.5',
					data: 'Child without dates',
					color: 'gray',
					linksInto: [],
					children: []
				},
				{
					id: '3.2',
					data: 'Child-parent',
					color: 'gray',
					start: Temporal.PlainDate.from('2025-01-08'),
					end: Temporal.PlainDate.from('2025-01-09'),
					linksInto: [],
					children: [{
						id: '3.2.1',
						data: 'Grandchild 1',
						color: 'gray',
						start: Temporal.PlainDate.from('2025-01-09'),
						end: Temporal.PlainDate.from('2025-01-10'),
						linksInto: [],
						children: []
					}]
				}
			]
		},
		{
			id: '2',
			data: 'Standalone 2',
			color: 'gray',
			start: Temporal.PlainDate.from('2025-01-01'),
			end: Temporal.PlainDate.from('2025-01-02'),
			linksInto: [],
			children: []
		}
	];

	const columns: ColumnDescriptor<GanttItem<string>, string>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			select: (row) => row.data,
			columnType: stringDataType,
			hierarchyColumn: true,
		}
	];

	return (
		<Gantt items={rows}
			   possibleColumns={columns}
			   initialColumnIds={['name']}
			   ganttKey={'roadmap-gantt'} />
	);
}
