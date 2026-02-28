import { DataType } from '@/base/data-type';
import { ReactNode } from 'react';

export type ColumnDescriptor<TData, TValue> = {
	columnId: string;
	columnName: string;

	hierarchyColumn?: boolean;
} & ColumnDescriptorRender<TData, TValue>;

type ColumnDescriptorRender<TData, TValue> = {
	columnType: DataType<TValue>;
	select: (data: TData) => TValue;
	onChange?: (fullData: TData, newValue: TValue) => void | Promise<void>;
} | {
	render: (data: TData) => ReactNode;
};