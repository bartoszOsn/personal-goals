import { ScrollArea, ScrollAreaAutosizeProps, Skeleton, Table, TableProps } from '@mantine/core';

export interface DataTableSkeletonProps {
	tableProps: TableProps;
	scrollAreaProps: ScrollAreaAutosizeProps;
}

export function DataTableSkeleton(props: DataTableSkeletonProps) {
	const columns = Array.from({ length: 3 }, (_, i) => i);
	const rows = Array.from({ length: 10 }, (_, i) => i);

	return (
		<ScrollArea.Autosize {...props.scrollAreaProps}>
			<Table {...props.tableProps}>
				<Table.Thead>
					<Table.Tr>
						{
							columns.map((column) => (
								<Table.Th key={column}>
									<Skeleton w='100%' h='100%' mih={30} />
								</Table.Th>
							))
						}
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{
						rows.map((row) => (
							<Table.Tr key={row}>
								{
									columns.map((column) => (
										<Table.Th key={column}>
											<Skeleton w='100%' h='100%' mih={20} />
										</Table.Th>
									))
								}
							</Table.Tr>
						))
					}
				</Table.Tbody>
			</Table>
		</ScrollArea.Autosize>
	)
}