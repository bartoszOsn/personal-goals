import { useAtomValue } from 'jotai';
import { autoScrollForElements, autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { getBoardAtoms } from '@/base/board/internal/state/getBoardAtoms';
import { Group, LoadingOverlay, ScrollArea } from '@mantine/core';
import { BoardColumn } from '@/base/board/internal/BoardColumn.tsx';
import { useEffect, useRef } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

export function BoardMain<TData, TColumnId>() {
	const props = useAtomValue(getBoardAtoms<TData, TColumnId>().propsAtom);
	const showLoadingOverlay = useAtomValue(getBoardAtoms<TData, TColumnId>().showLoadingOverlayAtom);

	const scrollAreaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!scrollAreaRef.current) {
			return;
		}

		return combine(
			autoScrollForElements({
				element: scrollAreaRef.current,
			}),
			autoScrollWindowForElements()
		);
	}, []);

	return (
		<ScrollArea.Autosize viewportRef={scrollAreaRef} scrollbars="x" offsetScrollbars>
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