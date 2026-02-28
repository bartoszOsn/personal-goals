import { ReactNode } from 'react';

export type ColumnDescriptor<TData> = {
	columnId: string;
	columnName: string;
	render: (data: TData) => ReactNode;
	hierarchyColumn?: boolean;
};