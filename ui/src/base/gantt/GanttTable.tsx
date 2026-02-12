import { Box, rem, Table } from '@mantine/core';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { useElementSize } from '@mantine/hooks';
import { useEffect, useRef } from 'react';
import type { RowPositionInfo } from './model/RowPositionInfo';

export function GanttTable<TData>() {
	const context = useGanttContext<TData>();
	const { ref, height } = useElementSize<HTMLTableElement>();
	const viewportRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		context.setScrollAreaHeight(height);
	}, [context, height]);

	useEffect(() => {
		if (!viewportRef.current) {
			return;
		}
		
		viewportRef.current.scrollTo({ left: viewportRef.current.scrollLeft, top: context.scrollY, behavior: 'instant'});
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
				height: tableRowBounds.height,
			}
		})
			.filter((item): item is RowPositionInfo => item !== null);


		if (JSON.stringify(rows) !== JSON.stringify(context.rows)) {
			context.setRows(rows);
		}
	}, [context, context.props.items, ref]);

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
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Name</Table.Th>
							<Table.Th>Start</Table.Th>
							<Table.Th>End</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{
							context.props.items.map(item => (
								<Table.Tr key={item.id} data-item-id={item.id}>
									<Table.Td>{item.name}</Table.Td>
									<Table.Td>{item.start.toLocaleDateString()}</Table.Td>
									<Table.Td>{item.end.toLocaleDateString()}</Table.Td>
								</Table.Tr>
							))
						}
					</Table.Tbody>
				</Table>
			</Table.ScrollContainer>
		</Box>
	);
}