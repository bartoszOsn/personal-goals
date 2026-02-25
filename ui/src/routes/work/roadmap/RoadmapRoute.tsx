import { type ColumnDescriptor, DataTable, useDataTableRows } from '@/base/data-table';
import { stringDataType } from '@/base/data-type';

export function RoadmapRoute() {
	const rows: TestNode[] = [
		{
			id: '1',
			name: 'Standalone 1',
			children: []
		},
		{
			id: '3',
			name: 'Root Parent',
			children: [
				{
					id: '3.1',
					name: 'Child 1',
					children: []
				},
				{
					id: '3.2',
					name: 'Child-parent',
					children: [{
						id: '3.2.1',
						name: 'Grandchild 1',
						children: []
					}]
				}
			]
		},
		{
			id: '2',
			name: 'Standalone 2',
			children: []
		}
	];

	const dataTableRows = useDataTableRows({
		rawData: rows,
		getId: row => row.id,
		getChildren: (row) => row.children
	})

	const columns: ColumnDescriptor<TestNode, unknown>[] = [
		{
			columnId: 'name',
			columnName: 'Name',
			select: (row) => row.name,
			columnType: stringDataType,
			onChange: () => {},
			hierarchyColumn: true
		}
	] as ColumnDescriptor<TestNode, unknown>[];

	return (
		<DataTable rows={dataTableRows}
				   possibleColumns={columns}
				   initialColumnIds={['name']}
				   tableKey={'test-table'} />
	)
}

interface TestNode {
	id: string;
	name: string;
	children: TestNode[];
}