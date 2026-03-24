import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Group, Space, Table } from '@mantine/core';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useClickOutside, usePrevious } from '@mantine/hooks';
import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { PER_LEVEL_OFFSET } from '@/base/data-table/internal/PER_LEVEL_OFFSET';
import { deepEqual } from '@tanstack/react-router';
import { ContextMenu } from '@/base/context-menu/api/ContextMenu';

export interface DataTableBodyProps<TData, TId> {
	columns: ColumnDescriptor<TData>[];
	rowInfo: FlattenRowsInfo<TData, TId>;
	onSelectionChange: (rows: TData[]) => void;
	toggleRow: (row: TId) => void;
	renderContextMenu?: (openedOn: TData, selected: TData[]) => ReactNode;
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

	const [contextMenuInfo, setContextMenuInfo] = useState<{opened: TId, selected: TId[]} | null>(null);
	const tBodyRef = useClickOutside(() => {
		clickOutside();
	}, ['mouseup', 'touchend']);

	const onTrClick = ((row: FlattenRow<TData, TId>, e: React.MouseEvent) => {
		clickedOn(row.id, e.shiftKey);
	});

	const onTrContextMenu = ((row: FlattenRow<TData, TId>) => {
		if (props.renderContextMenu) {
			setContextMenuInfo({ opened: row.id, selected: selectedRows });
		}
	});

	return (
		<Table.Tbody ref={tBodyRef} style={{ userSelect: 'none' }}>
			{
				rowInfo.rows.map((row) => {
					if (!row.visible) {
						return null;
					}

					const bgColor = selectedRows.includes(row.id)
						? 'blue.0'
						: row.backgroundColor
							? `${row.backgroundColor}.0`
							: 'white';

					return (
						<ContextMenu disabled={!props.renderContextMenu} onChange={(o) => o ? onTrContextMenu(row) : setContextMenuInfo(null)} dropdown={
							props.renderContextMenu
							&& contextMenuInfo
							&& props.renderContextMenu(
								rowInfo.rows.find((r) => contextMenuInfo && r.id === contextMenuInfo.opened)!.data,
								rowInfo.rows.filter((r) => contextMenuInfo && contextMenuInfo.selected.includes(r.id))!.map((r) => r.data)
							)
						}>
							<Table.Tr key={`${row.id}`}
									  bg={bgColor}
									  data-row-id={`${row.id}`}
									  onClick={(e) => onTrClick(row, e)}>
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
						</ContextMenu>
					);
				})
			}
		</Table.Tbody>
	);
}