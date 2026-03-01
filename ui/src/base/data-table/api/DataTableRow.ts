import { MantineColor } from '@mantine/core';

export interface DataTableRow<TData, TId> {
	id: TId;
	data: TData;
	children: DataTableRow<TData, TId>[];
	backgroundColor?: MantineColor;
}