import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Box, CloseButton, Group, Popover, Table, Text } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { DataTableCustomizationPopover } from '@/base/data-table/internal/DataTableCustomizationPopover';

interface DataTableHeaderProps<TData> {
	columns: ColumnDescriptor<TData, unknown>[];
	allPossibleColumns: ColumnDescriptor<TData, unknown>[];
	setColumns: (columns: ColumnDescriptor<TData, unknown>[]) => void;
}

export function DataTableHeader<TData>(props: DataTableHeaderProps<TData>) {
	const isMoreThanOneColumn = props.columns.length > 1;

	return (
		<Table.Thead>
			<Table.Tr>
				{props.columns.map((column, index) => {
					const isLastColumn = index === props.columns.length - 1;

					return (
						<Table.Th key={column.columnId}>
							<Group gap={2} justify='space-between'>
								<Group gap={2}>
									<Text inline inherit>
										{column.columnName}
									</Text>
									<CloseButton disabled={!isMoreThanOneColumn} size="xs" onClick={() => props.setColumns(props.columns.filter((_, i) => i !== index))} />
								</Group>
								{
									!isLastColumn && (
										<Box w={2} h={18} bg='gray.1' />
									)
								}
								{
									isLastColumn && (
										<Popover shadow='md' withArrow>
											<Popover.Target>
												<ActionIcon size="xs" variant='subtle' color='gray'>
													<IconDots size={12} />
												</ActionIcon>
											</Popover.Target>
											<Popover.Dropdown>
												<DataTableCustomizationPopover allPossibleColumns={props.allPossibleColumns}
																			   visibleColumns={props.columns}
																			   setColumns={props.setColumns} />
											</Popover.Dropdown>
										</Popover>
									)
								}
							</Group>
						</Table.Th>
					);
				})}
			</Table.Tr>
		</Table.Thead>
	)
}