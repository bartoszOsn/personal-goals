import { MantineColor } from '@mantine/core';

export interface BoardColumn<TColumnId> {
	columnId: TColumnId;
	name: string;
	color?: MantineColor;
}