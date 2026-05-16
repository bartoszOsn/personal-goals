import { MantineColor } from '@mantine/core';

export interface BoardColumnDefinition<TColumnId> {
	columnId: TColumnId;
	name: string;
	color?: MantineColor;
}