import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Group, Space, Table } from '@mantine/core';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import { useEffect, useMemo } from 'react';
import { useClickOutside, usePrevious } from '@mantine/hooks';
import { FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { PER_LEVEL_OFFSET } from '@/base/data-table/internal/PER_LEVEL_OFFSET';
import { deepEqual } from '@tanstack/react-router';

export interface DataTableBodyProps<TData, TId> {
	columns: ColumnDescriptor<TData>[];
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

	const prevSelected = usePrevious(selectedRows);

	useEffect(() => {
		if (deepEqual(selectedRows, prevSelected)) {
			return;
		}

		onSelectionChange(
			rowInfo.rows
				.filter((row) => selectedRows.includes(row.id))
				.map(row => row.data)
		);
	}, [onSelectionChange, prevSelected, rowInfo.rows, selectedRows]);

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
								  data-row-id={`${row.id}`}
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
											{
												column.render(row.data)
											}
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