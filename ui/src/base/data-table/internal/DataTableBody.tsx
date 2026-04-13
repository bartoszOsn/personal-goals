import { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor.tsx';
import { ActionIcon, Group, Table } from '@mantine/core';
import { useRowSelection } from '@/base/data-table/internal/useRowSelection';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useClickOutside, usePrevious } from '@mantine/hooks';
import { FlattenRow, FlattenRowsInfo } from '@/base/data-table/internal/useFlattenRows';
import { IconChevronDown, IconChevronRight, IconGripVertical } from '@tabler/icons-react';
import { PER_LEVEL_OFFSET } from '@/base/data-table/internal/PER_LEVEL_OFFSET';
import { deepEqual } from '@tanstack/react-router';
import { ContextMenu } from '@/base/context-menu/api/ContextMenu';
import { useRowDragAndDrop } from '@/base/data-table/internal/useRowDragAndDrop';
import { DataTableRowMoveProps } from '@/base/data-table';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { createHitboxMatcher } from '@/base/pragmatic-dnd-x/crateHitboxMatcher';

export interface DataTableBodyProps<TData, TId> {
	columns: ColumnDescriptor<TData>[];
	rowInfo: FlattenRowsInfo<TData, TId>;
	onSelectionChange: (rows: TData[]) => void;
	toggleRow: (row: TId) => void;
	renderContextMenu?: (openedOn: TData, selected: TData[]) => ReactNode;
	rowMove?: DataTableRowMoveProps<TData, TId>;
}

export function DataTableRow<TData, TId>(props: {
	bodyProps: DataTableBodyProps<TData, TId>;
	row: FlattenRow<TData, TId>;
	selectedRows: TId[];
	onClick: (row: FlattenRow<TData, TId>, e: React.MouseEvent) => void;
	contextMenuInfo: { opened: TId, selected: TId[] } | null;
	setContextMenuInfo: (value: { opened: TId, selected: TId[] } | null) => void;
	onTrContextMenu: (row: FlattenRow<TData, TId>) => void;
	rowDndEnabled: boolean;
	rowDragAndDropApi: ReturnType<typeof useRowDragAndDrop<TData, TId>>
}) {
	const handleRef = useRef<HTMLButtonElement>(null);
	const ref = useRef<HTMLTableRowElement>(null);

	useEffect(() => {
		if (!ref.current || !handleRef.current) return;

		const hitboxes = props.rowDragAndDropApi.rowToAvailableHitboxesMap.get(props.row) ?? [];
		const matchHitbox = createHitboxMatcher({
			top: hitboxes.includes('top') ? {
				top: 0,
				bottom: { percent: hitboxes.includes('middle') ? 75 : 50 },
				left: 0,
				right: 0,
			} : undefined,
			middle: hitboxes.includes('middle') ? {
				top: { percent: hitboxes.includes('top') ? 25 : 0 },
				bottom: { percent: hitboxes.includes('bottom') ? 25 : 100 },
				left: 0,
				right: 0,
			} : undefined,
			bottom: hitboxes.includes('bottom') ? {
				top: { percent: hitboxes.includes('middle') ? 75 : 50 },
				bottom: { percent: 0 },
				left: 0,
				right: 0,
			} : undefined,
		});

		return combine(
			draggable({
				element: ref.current,
				dragHandle: handleRef.current,
				onDragStart: () => {
					props.rowDragAndDropApi.dragStart(props.row);
				},
				onDrop: () => {
					props.rowDragAndDropApi.drop();
				}
			}),
			dropTargetForElements({
				element: ref.current,
				canDrop: () => hitboxes.length > 0,
				onDrag: (e) => {
					const hitbox = matchHitbox(e.self.element, e.location.current.input);
					if (!hitbox) {
						props.rowDragAndDropApi.exitDropTarget();
					} else {
						props.rowDragAndDropApi.enterDropTarget(props.row, hitbox);
					}
				},
				onDragLeave: () => {
					props.rowDragAndDropApi.exitDropTarget();
				}
			})
		);
	}, [props.row, props.rowDragAndDropApi]);

	if (!props.row.visible) {
		return null;
	}

	const bgColor =
		props.selectedRows.includes(props.row.id)
			? 'blue.0'
			: props.row.backgroundColor
				? `${props.row.backgroundColor}.0`
				: 'white';

	const isParentDropIndicator = props.rowDragAndDropApi.parentDropIndicator?.id === props.row.id;

	return (
		<ContextMenu key={`${props.row.id}`} disabled={!props.bodyProps.renderContextMenu}
					 onChange={(o) => o ? props.onTrContextMenu(props.row) : props.setContextMenuInfo(null)} dropdown={
			props.bodyProps.renderContextMenu
			&& props.contextMenuInfo
			&& props.bodyProps.renderContextMenu(
				props.bodyProps.rowInfo.rows.find((r) => props.contextMenuInfo && r.id === props.contextMenuInfo.opened)!.data,
				props.bodyProps.rowInfo.rows.filter((r) => props.contextMenuInfo && props.contextMenuInfo.selected.includes(r.id))!.map((r) => r.data)
			)
		}>
			<Table.Tr
				ref={ref}
				bg={bgColor}
				style={{
					borderTop: props.rowDragAndDropApi.aboveDropIndicator?.id === props.row.id ? '1px solid blue' : '1px solid transparent',
					borderBottom: props.rowDragAndDropApi.belowDropIndicator?.id === props.row.id ? '1px solid blue' : undefined,
					opacity: props.rowDragAndDropApi.dimmedRows.some(r => r.id === props.row.id) ? 0.5 : 1,
				}}
				data-row-id={`${props.row.id}`}
				onClick={(e) => props.onClick(props.row, e)}>
				{
					props.rowDndEnabled && (
						<Table.Td>
							<ActionIcon ref={handleRef} style={{ cursor: 'grab' }} variant="subtle" size="xs" color="gray">
								<IconGripVertical size={12} />
							</ActionIcon>
						</Table.Td>
					)
				}
				{
					props.bodyProps.columns.map((column, i) => (
						<Table.Td key={column.columnId}
								  style={{ overflow: 'hidden' }} colSpan={i === props.bodyProps.columns.length - 1 ? 2 : 1}>
							<Group wrap="nowrap"
								   gap="sm"
								   h={20}
								   pl={column.hierarchyColumn && props.bodyProps.rowInfo.maxLevels > 0 ? (props.row.level * PER_LEVEL_OFFSET) : 0}>
								{
									column.hierarchyColumn && (
										<ActionIcon variant={isParentDropIndicator ? 'light' : 'transparent' }
													style={{ visibility: props.row.hasChildren || isParentDropIndicator ? 'visible' : 'hidden' }}
													color={ isParentDropIndicator ? 'blue' : 'gray' }
													size="xs"
													onClick={() => props.bodyProps.toggleRow(props.row.id)}>
											{
												props.row.expanded ? <IconChevronDown /> : <IconChevronRight />
											}
										</ActionIcon>
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
		rowInfo
	} = props;

	const allRowIds = rowInfo.rows.map(row => row.id);

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

	const [contextMenuInfo, setContextMenuInfo] = useState<{ opened: TId, selected: TId[] } | null>(null);
	const tBodyRef = useClickOutside<HTMLTableSectionElement>(() => {
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

	const rowDragAndDropApi = useRowDragAndDrop({
		flattenedRowInfo: props.rowInfo,
		rowMoveProps: props.rowMove
	});

	// useEffect(() => {
	// 	if (!props.rowMove) {
	// 		return;
	// 	}
	//
	// 	if (!tBodyRef.current) {
	// 		return;
	// 	}
	//
	// 	return dropTargetForElements({
	// 		element: tBodyRef.current,
	// 		onDragEnter: () => {
	// 			rowDragAndDropApi.enterGlobalTableDropTarget();
	// 		},
	// 		onDragLeave: () => {
	// 			rowDragAndDropApi.exitGlobalTableDropTarget();
	// 		},
	// 	})
	// }, [props.rowMove, rowDragAndDropApi, tBodyRef]);

	return(
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
										 onTrContextMenu={onTrContextMenu}
										 rowDndEnabled={!!props.rowMove}
										 rowDragAndDropApi={rowDragAndDropApi} />;
				})
			}
		</Table.Tbody>
	);
}