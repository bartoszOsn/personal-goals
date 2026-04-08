import { useAtomValue } from 'jotai';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { BoardColumn } from '@/base/board/internal/BoardColumn.tsx';

export function BoardMain<TData, TColumnId>() {
	const props = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const showLoadingOverlay = useAtomValue(getBoardAtoms<TData, TColumnId>().showLoadingOverlayAtom);
	return (
		<ScrollArea.Autosize scrollbars="x" offsetScrollbars>
			<LoadingOverlay visible={showLoadingOverlay} />
			<Group wrap="nowrap" align="stretch" pos="relative">
				{
					props.columns.map((column) => {
						return (
							<BoardColumn key={`${column.columnId}`}
										 column={column} />
						);
					})
				}
			</Group>
		</ScrollArea.Autosize>
	);
}