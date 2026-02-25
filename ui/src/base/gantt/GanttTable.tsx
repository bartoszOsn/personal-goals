import { Box, px, rem } from '@mantine/core';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import type { RowPositionInfo } from './model/RowPositionInfo';
import { type ColumnDescriptor, DataTable, useDataTableRows } from '@/base/data-table';
import { type DataTableRow } from '@/base/data-table/api/DataTableRow';
import { type GanttItem } from '@/base/gantt/GanttItem';

export function GanttTable<TData>() {
	const context = useGanttContext<TData>();
	const { ref, height } = useElementSize<HTMLTableElement>();
	const viewportRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		context.setScrollAreaHeight(height);
	}, [context, height]);

	useEffect(() => {
		return context.subscribeToScrollY(y => {
			if (!viewportRef.current) {
				return;
			}

			viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: y, behavior: 'instant' });
		});
	}, [context]);

	useEffect(() => {
		const table = ref.current;

		if (!table) return;

		const tableBounds = table.getBoundingClientRect();

		const rows: RowPositionInfo[] = context.props.items.map(item => {
			const tableRow = table.querySelector(`[data-row-id="${item.id}"]`);

			if (!tableRow) return null;

			const tableRowBounds = tableRow.getBoundingClientRect();

			return {
				id: item.id,
				top: tableRowBounds.top - tableBounds.top,
				height: tableRowBounds.height
			};
		})
			.filter((item): item is RowPositionInfo => item !== null);


		if (JSON.stringify(rows) !== JSON.stringify(context.rows)) {
			context.setRows(rows);
		}
	}, [context, context.props.items, ref]);

	const dataTableRows: DataTableRow<GanttItem<TData>, string>[] = useDataTableRows({
		rawData: context.props.items,
		getId: (item) => item.id,
		getChildren: () => [],
	});

	const onSelectionChange = (rows: GanttItem<TData>[]) => {
		const itemIds = rows.map(row => row.id);
		context.props.setSelectedItemIds?.(itemIds);
		context.selectedItemIdsRef.current = itemIds;
	}

	return (
		<Box w={rem(300)} h="100%">
			<DataTable rows={dataTableRows}
					   possibleColumns={context.props.possibleColumns as ColumnDescriptor<GanttItem<TData>, unknown>[]}
					   initialColumnIds={context.props.initialColumnIds}
					   tableKey={`${context.props.ganttKey}-table`}
					   tableProps={{ stickyHeader: true }}
					   scrollAreaProps={{
						   h: '100%',
						   viewportRef: viewportRef,
						   onScrollPositionChange: ({ y }) => context.setScrollY(y),
						   viewportProps: {
							   style: { paddingBottom: 0 }
						   }
					   }}
					   tableHeaderProps={{
						   h: px(context.chartHeaderSize)
					   }}
					   onSelectionChange={onSelectionChange}
					   tableRef={ref} />
		</Box>
	);
}