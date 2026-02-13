import { Box, px, rem, Table } from '@mantine/core';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import type { RowPositionInfo } from './model/RowPositionInfo';
import type { GanttItem } from '@/base/gantt/GanttItem';

export function GanttTable<TData>() {
	const context = useGanttContext<TData>();
	const { ref, height } = useElementSize<HTMLTableElement>();
	const viewportRef = useRef<HTMLDivElement>(null);
	const lastSelectedRowIdRef = useRef<string>(null);

	useEffect(() => {
		context.setScrollAreaHeight(height);
	}, [context, height]);

	useEffect(() => {
		if (!viewportRef.current) {
			return;
		}

		viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: context.scrollY, behavior: 'instant' });
	}, [context.scrollY]);

	useEffect(() => {
		const table = ref.current;

		if (!table) return;

		const tableBounds = table.getBoundingClientRect();

		const rows: RowPositionInfo[] = context.props.items.map(item => {
			const tableRow = table.querySelector(`[data-item-id="${item.id}"]`);

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

	const onRowClick = (e: React.MouseEvent<HTMLTableRowElement>, row: GanttItem<TData>) => {
		if (context.props.selectedItemIds?.includes(row.id)) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();

		if (!e.shiftKey || !lastSelectedRowIdRef.current) {
			context.props.setSelectedItemIds?.([row.id]);
			lastSelectedRowIdRef.current = row.id;
		} else {
			const lastSelectedRow = context.props.items.find(item => item.id === lastSelectedRowIdRef.current);
			if (!lastSelectedRow) return;
			const selectedIds = context.props.selectedItemIds || [];
			const startIndex = context.props.items.indexOf(lastSelectedRow);
			const endIndex = context.props.items.indexOf(row);
			const newSelectedIds = [...selectedIds];
			for (let i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
				if (newSelectedIds.includes(context.props.items[i].id)) {
					continue;
				}
				newSelectedIds.push(context.props.items[i].id);
			}
			context.props.setSelectedItemIds?.(newSelectedIds);
		}
	};

	return (
		<Box w={rem(300)} h="100%">
			<Table.ScrollContainer minWidth={rem(300)}
								   h="100%"
								   scrollAreaProps={{
									   viewportRef: viewportRef,
									   onScrollPositionChange: ({ y }) => context.setScrollY(y),
									   viewportProps: {
										   style: { paddingBottom: 0 }
									   }
								   }}>
				<Table ref={ref} stickyHeader>
					<Table.Thead h={px(context.chartHeaderSize)}>
						<Table.Tr>
							<Table.Th>Name</Table.Th>
							<Table.Th>Start</Table.Th>
							<Table.Th>End</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody style={{ userSelect: 'none' }}>
						{
							context.props.items.map(item => (
								<Table.Tr key={item.id}
										  data-item-id={item.id}
										  bg={context.props.selectedItemIds?.includes(item.id) ? 'var(--mantine-color-blue-light)' : undefined}
										  onClick={(e) => onRowClick(e, item)}>
									<Table.Td>{item.name}</Table.Td>
									<Table.Td>{item.start.toLocaleString()}</Table.Td>
									<Table.Td>{item.end.toLocaleString()}</Table.Td>
								</Table.Tr>
							))
						}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Box>
	);
}