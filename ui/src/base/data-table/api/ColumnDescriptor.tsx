import { DataType } from '@/base/data-type';

export interface ColumnDescriptor<TData, TValue> {
	columnId: string;
	columnName: string;
	columnType: DataType<TValue>;
	select: (data: TData) => TValue;
	onChange?: (fullData: TData, newValue: TValue) => void | Promise<void>;
	hierarchyColumn?: boolean;
}