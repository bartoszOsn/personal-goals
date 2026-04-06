import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Group, Space, Table } from '@mantine/core';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useClickOutside, usePrevious } from '@mantine/hooks';
import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows';
import { IconChevronDown, IconChevronRight, IconGripVertical } from '@tabler/icons-react';
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

export function DataTableRow<TData, TId>(props: {
	bodyProps: DataTableBodyProps<TData, TId>;
	row: FlattenRow<TData, TId>;
	selectedRows: TId[];
	onClick: (row: FlattenRow<TData, TId>, e: React.MouseEvent) => void;
	contextMenuInfo: {opened: TId, selected: TId[]} | null;
	setContextMenuInfo: (value: {opened: TId, selected: TId[]} | null) => void;
	onTrContextMenu: (row: FlattenRow<TData, TId>) => void;
}) {
	if (!props.row.visible) {
		return null;
	}

	const bgColor = props.selectedRows.includes(props.row.id)
		? 'blue.0'
		: props.row.backgroundColor
			? `${props.row.backgroundColor}.0`
			: 'white';

	return (
		<ContextMenu key={`${props.row.id}`} disabled={!props.bodyProps.renderContextMenu} onChange={(o) => o ? props.onTrContextMenu(props.row) : props.setContextMenuInfo(null)} dropdown={
			props.bodyProps.renderContextMenu
			&& props.contextMenuInfo
			&& props.bodyProps.renderContextMenu(
				props.bodyProps.rowInfo.rows.find((r) => props.contextMenuInfo && r.id === props.contextMenuInfo.opened)!.data,
				props.bodyProps.rowInfo.rows.filter((r) => props.contextMenuInfo && props.contextMenuInfo.selected.includes(r.id))!.map((r) => r.data)
			)
		}>
			<Table.Tr
				bg={bgColor}
				data-row-id={`${props.row.id}`}
				onClick={(e) => props.onClick(props.row, e)}>
				<Table.Td>
					<ActionIcon variant='subtle' size='xs' color='gray'>
						<IconGripVertical size={12} />
					</ActionIcon>
				</Table.Td>
				{
					props.bodyProps.columns.map((column, i) => (
						<Table.Td key={column.columnId}
								  style={{ overflow: 'hidden' }} colSpan={i === props.bodyProps.columns.length - 1 ? 2 : 1}>
							<Group wrap="nowrap"
								   gap="sm"
								   h={20}
								   pl={column.hierarchyColumn && props.bodyProps.rowInfo.maxLevels > 0 ? (props.row.level * PER_LEVEL_OFFSET + (props.row.hasChildren ? 0 : PER_LEVEL_OFFSET)) : 0}>
								{
									column.hierarchyColumn && (
										<>
											{
												props.row.hasChildren ? (
													<ActionIcon variant="transparent" color="gray" size="xs" onClick={() => props.bodyProps.toggleRow(props.row.id)}>
														{
															props.row.expanded ? <IconChevronDown /> : <IconChevronRight />
														}
													</ActionIcon>
												) : <Space />
											}
										</>
									)
								}
								{
									column.render(props.row.data)
								}
							</Group>
						</Table.Td>
					))
				}
			</Table.Tr>
		</ContextMenu>
	);
}

export function DataTableBody<TData, TId>(props: DataTableBodyProps<TData, TId>) {
	const {
		onSelectionChange,
		rowInfo,
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
					return <DataTableRow key={`${row.id}`}
										 bodyProps={props}
										 row={row}
										 selectedRows={selectedRows}
										 onClick={onTrClick}
										 contextMenuInfo={contextMenuInfo}
										 setContextMenuInfo={setContextMenuInfo}
										 onTrContextMenu={onTrContextMenu} />
				})
			}
		</Table.Tbody>
	);
}