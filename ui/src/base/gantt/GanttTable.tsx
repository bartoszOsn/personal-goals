import { Box, rem, Table } from '@mantine/core';
import { useGanttContext } from '@/base/gantt/GanttProvider';

export function GanttTable<TData>() {
	const context = useGanttContext<TData>();

	return (
		<Box w={rem(300)} h="100%">
			<Table.ScrollContainer minWidth={rem(300)} h="100%">
				<Table stickyHeader>
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
								<Table.Tr key={item.id}>
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