import { Fragment, Key, ReactNode } from 'react';
import { BoardColumn, BoardItem } from '@/base/board/api/BoardProps.ts';
import { Card } from '@/primitive/components/ui/card.tsx';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/primitive/components/ui/item';
import { Draggable } from '@/base/dnd/api/Draggable';
import { Droppable } from '@/base/dnd/api/Droppable';
import { getBoardItemDndContext } from '@/base/board/internal/boardItemDndContext';
import { LineDropIndicator } from '@/base/dnd/api/LineDropIndicator';
import { createHitboxMatcher } from '@/base/pragmatic-dnd-x/crateHitboxMatcher';

export function BoardColumnBlock<TItemData, TItemId extends Key, TColumnId extends Key>({
																							column,
																							items,
																							renderItemCard
																						}: {
	column: BoardColumn<TColumnId>,
	items: BoardItem<TItemData, TItemId, TColumnId>[],
	renderItemCard: (item: TItemData, itemId: TItemId, columnId: TColumnId) => ReactNode
}) {
	const dndContext = getBoardItemDndContext<TItemData, TItemId, TColumnId>();

	return (
		<Droppable context={dndContext} getData={() => ({ columnId: column.columnId })}>
			<div className="flex flex-col shrink-0 gap-0 border bg-background rounded-xl w-72 p-4 min-h-40">
				<Item>
					<ItemMedia>{column.columnIcon}</ItemMedia>
					<ItemContent>
						<ItemTitle>{column.columnHeader}</ItemTitle>
					</ItemContent>
					<ItemActions>
						{column.columnAction}
					</ItemActions>
				</Item>
				{
					items.map(item => (
						<Fragment key={item.id}>
							<LineDropIndicator isVisible={(_, drop) => 'before' in drop && drop.before === item.id } context={dndContext} />
							<Droppable context={dndContext} withBorderIndicator={false} getData={(_, element, input) => {
								const matchHitbox = createHitboxMatcher({
									top: {
										top: 0,
										left: 0,
										right: 0,
										bottom: { percent: 50 }
									},
									bottom: {
										top: { percent: 50 },
										left: 0,
										right: 0,
										bottom: 0
									}
								});

								const hitbox = matchHitbox(element, input);

								switch (hitbox) {
									case 'top':
										return { columnId: column.columnId, before: item.id };
									case 'bottom':
										return { columnId: column.columnId, after: item.id };
									default:
										return { columnId: column.columnId };
								}
							}}>
								<Draggable context={dndContext} data={item}>
									<Card key={item.id} className='my-2'>
										{renderItemCard(item.data, item.id, column.columnId)}
									</Card>
								</Draggable>
							</Droppable>
							<LineDropIndicator isVisible={(_, drop) => 'after' in drop && drop.after === item.id } context={dndContext} />
						</Fragment>

					))
				}
			</div>
		</Droppable>
	);
}