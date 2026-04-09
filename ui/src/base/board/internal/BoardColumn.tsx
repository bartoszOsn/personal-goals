import { BoardColumnDefinition } from '@/base/board';
import { Button, Card, Divider, Stack, Text } from '@mantine/core';
import { ItemCard } from '@/base/board/internal/ItemCard.tsx';
import { IconPlus } from '@tabler/icons-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { useEffect, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

export function BoardColumn<TData, TColumnId>(props: {
	column: BoardColumnDefinition<TColumnId>
}) {
	const boardProps = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const itemsInColumn = boardProps.items
		.filter(item => boardProps.itemColumnSelector(item) === props.column.columnId);
	const createItem = useSetAtom(getBoardAtoms<TData, TColumnId>().createItemActionAtom);
	const isCreateButtonPending = useAtomValue(getBoardAtoms<TData, TColumnId>().createButtonPendingAtom);
	const [dropTargetColumn, setDropTargetColumn] = useAtom(getBoardAtoms<TData, TColumnId>().dropTargetColumnAtom);
	const dropTargetItem = useAtomValue(getBoardAtoms<TData, TColumnId>().dropTargetItemAtom);
	
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}
		
		return dropTargetForElements({
			element: ref.current,
			onDragEnter: () => {
				setDropTargetColumn({ column: props.column.columnId });
			},
			onDragLeave: () => {
				setDropTargetColumn(null);
			}
		});
	}, [props.column.columnId, setDropTargetColumn]);
	
	return <Card w={boardProps.columnWidth}
				 ref={ref}
				 withBorder
				 style={{ flexShrink: 0, borderColor: dropTargetColumn?.column === props.column.columnId ? 'var(--mantine-color-blue-5)' : undefined }}
				 bg={props.column.color ? `${props.column.color}.1` : 'gray.1'}
				 pos="relative">
		<Stack w="100%" gap='xs'>
			<Text fw={500}>{props.column.name}</Text>
			{
				itemsInColumn.length === 0 ? (
					<Text c={'dimmed'}>{boardProps.noItemsInColumnText}</Text>
				) : (
					<>
						<Divider color={dropTargetItem && 'beforeItem' in dropTargetItem && boardProps.itemIdSelector(dropTargetItem.beforeItem) === boardProps.itemIdSelector(itemsInColumn[0]) ? 'blue.5' : 'transparent' } />
						{
							itemsInColumn.map((item, index) => <>
									<ItemCard key={boardProps.itemIdSelector(item)} item={item} index={index} column={props.column} />
									<Divider color={
										dropTargetItem && (
											'afterItem' in dropTargetItem && boardProps.itemIdSelector(dropTargetItem.afterItem) === boardProps.itemIdSelector(itemsInColumn[index])
											|| 'beforeItem' in dropTargetItem && itemsInColumn[index + 1] && boardProps.itemIdSelector(dropTargetItem.beforeItem) === boardProps.itemIdSelector(itemsInColumn[index + 1])
										) ? 'blue.5' : 'transparent'
									} />
								</>
								)
						}
					</>
				)
			}
			<Button variant="light" color={props.column.color ?? 'gray'} leftSection={<IconPlus />} loading={isCreateButtonPending} onClick={() => createItem(props.column.columnId)}>
				{boardProps.createButtonText}
			</Button>
		</Stack>
	</Card>;
}