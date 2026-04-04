import { useState } from 'react';
import { Group, ScrollArea } from '@mantine/core';
import { BoardProps } from '@/base/board/api/BoardProps';
import { BoardColumn } from '@/base/board/internal/BoardColumn';

export function Board<TData, TColumnId>(props: BoardProps<TData, TColumnId>) {
	const [creationPending, setCreationPending] = useState(false);
	const createItem = async (columnId: TColumnId) => {
		setCreationPending(true);
		await props.onCreateItem(columnId);
		setCreationPending(false);
	};

	return (
		<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
			<Group wrap="nowrap" align="stretch" pos="relative">
				{
					props.columns.map((column) => {
						return (
							<BoardColumn key={`${column.columnId}`}
										 column={column}
										 loading={creationPending}
										 onCreateBtnClick={() => createItem(column.columnId)}
										 boardProps={props} />
						);
					})
				}
			</Group>
		</ScrollArea.Autosize>
	);
}