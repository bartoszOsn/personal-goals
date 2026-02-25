import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Group, Space, Table } from '@mantine/core';
import { DataView } from '@/base/data-type';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import { useEffect, useMemo } from 'react';
import { useClickOutside } from '@mantine/hooks';
import type { FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { PER_LEVEL_OFFSET } from '@/base/data-table/internal/PER_LEVEL_OFFSET';

export interface DataTableBodyProps<TData, TId> {
	columns: ColumnDescriptor<TData, unknown>[];
	rowInfo: FlattenRowsInfo<TData, TId>;
	onSelectionChange: (rows: TData[]) => void;
	toggleRow: (row: TId) => void;
}

export function DataTableBody<TData, TId>(props: DataTableBodyProps<TData, TId>) {
	const {
		columns,
		onSelectionChange,
		rowInfo,
		toggleRow
	} = props;

	const allRowIds = useMemo(() => rowInfo.rows.map(row => row.id), [rowInfo]);

	const {
		selectedRows,
		clickedOn,
		clickOutside
	} = useRowSelection(allRowIds);

	useEffect(() => {
		onSelectionChange(
			rowInfo.rows
				.filter((row) => selectedRows.includes(row.id))
				.map(row => row.data)
		);
	}, [onSelectionChange, rowInfo.rows, selectedRows]);

	const tBodyRef = useClickOutside(clickOutside);

	return (
		<Table.Tbody ref={tBodyRef} style={{ userSelect: 'none' }}>
			{
				rowInfo.rows.map((row) => {
					if (!row.visible) {
						return null;
					}

					return (
						<Table.Tr key={`${row.id}`}
								  bg={selectedRows.includes(row.id) ? 'blue.0' : 'white'}
								  onClick={(e) => clickedOn(row.id, e.shiftKey)}>
							{
								columns.map((column) => (
									<Table.Td key={column.columnId}>
										<Group wrap="nowrap"
											   gap="sm"
											   pl={column.hierarchyColumn && rowInfo.maxLevels > 0 ? (row.level * PER_LEVEL_OFFSET + (row.hasChildren ? 0 : PER_LEVEL_OFFSET)) : 0}>
											{
												column.hierarchyColumn && (
													<>
														{
															row.hasChildren ? (
																<ActionIcon variant="transparent" color="gray" size="xs" onClick={() => toggleRow(row.id)}>
																	{
																		row.expanded ? <IconChevronDown /> : <IconChevronRight />
																	}
																</ActionIcon>
															) : <Space />
														}
													</>
												)
											}
											<DataView value={column.select(row.data)}
													  onChange={(newValue) => column.onChange(row.data, newValue)}
													  dataType={column.columnType} />
										</Group>
									</Table.Td>
								))
							}
						</Table.Tr>
					);
				})
			}
		</Table.Tbody>
	);
}