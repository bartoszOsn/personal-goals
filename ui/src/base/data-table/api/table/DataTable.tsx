import type { DataType } from '@/base/data-type/DataType.ts';

export interface DataTable<TData, TId> {
	rows: TData[];
	idSelector: (row: TData) => TId;
	possibleColumns: ColumnDescriptor<TData, unknown>[]
}

export interface ColumnDescriptor<TData, TValue> {
	columnId: string;
	columnName: string;
	columnType: DataType<TValue>
	select: (data: TData) => TValue
}