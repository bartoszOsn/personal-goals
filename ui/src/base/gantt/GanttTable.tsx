import { Box, px, rem } from '@mantine/core';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { RowPositionInfo } from './model/RowPositionInfo';
import { ColumnDescriptor, DataTable, useDataTableRows } from '@/base/data-table';
import { DataTableRow } from '@/base/data-table/api/DataTableRow';
import { GanttItem } from '@/base/gantt/GanttItem';
import { flatItems } from '@/base/gantt/FlatItems';

export function GanttTable<TData>() {
	const context = useGanttContext<TData>();
	const { ref: tableRef, height: tableHeight } = useElementSize<HTMLTableElement>();
	const { ref: boxRef, height: boxHeight } = useElementSize<HTMLDivElement>();
	const viewportRef = useRef<HTMLDivElement>(null);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	useEffect(() => {
		const actualHeight = Math.max(tableHeight, boxHeight - 10); // Why `- 10`? Who knows ¯\_(ツ)_/¯ It doesn't work properly without it.
		context.setScrollAreaHeight(actualHeight);
	}, [context, tableHeight, boxHeight]);

	useEffect(() => {
		return context.subscribeToScrollY(y => {
			if (!viewportRef.current) {
				return;
			}

			viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: y, behavior: 'instant' });
		});
	}, [context]);

	useEffect(() => {
		const table = tableRef.current;

		if (!table) return;

		const tableBounds = table.getBoundingClientRect();

		const rows: RowPositionInfo[] = flatItems(context.props.items)
			.map(item => {

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
	}, [context, context.props.items, tableRef, expandedItems]);

	const dataTableRows: DataTableRow<GanttItem<TData>, string>[] = useDataTableRows({
		rawData: context.props.items,
		getId: (item) => item.id,
		getChildren: (item) => item.children,
		getColor: (item) => item.backgroundColor,
	});

	const onSelectionChange = (rows: GanttItem<TData>[]) => {
		const itemIds = rows.map(row => row.id);
		context.props.setSelectedItemIds?.(itemIds);
		// eslint-disable-next-line react-hooks/immutability
		context.selectedItemIdsRef.current = itemIds;
	};

	return (
		<Box w={rem(300)} h="100%" ref={boxRef}>
			<DataTable rows={dataTableRows}
					   possibleColumns={context.props.possibleColumns as ColumnDescriptor<GanttItem<TData>>[]}
					   initialColumnIds={context.props.initialColumnIds}
					   tableKey={`${context.props.ganttKey}-table`}
					   tableProps={{ stickyHeader: true }}
					   scrollAreaProps={{
						   h: '100%',
						   viewportRef: viewportRef,
						   onScrollPositionChange: ({ y }) => context.setScrollY(y),
						   styles: { root: { height: '100%' } },
						   viewportProps: {
							   style: { paddingBottom: 0, height: '100%' },
						   }
					   }}
					   tableHeaderProps={{
						   h: px(context.chartHeaderSize),
						   style: { verticalAlign: 'bottom' }
					   }}
					   onSelectionChange={onSelectionChange}
					   onExpansionChange={setExpandedItems}
					   renderContextMenu={context.props.renderContextMenu}
					   tableRef={tableRef}
					   rowMove={context.props.rowMove}/>
		</Box>
	);
}

