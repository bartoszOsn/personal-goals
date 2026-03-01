import { ColumnDescriptor } from '@/base/data-table';

export function mapColumnData<Tin, Tout>(
	mapper: (input: Tin) => Tout,
	columns: ColumnDescriptor<Tout>[]
): ColumnDescriptor<Tin>[] {
	return columns.map(column => ({
		...column,
		render: (item: Tin) => column.render(mapper(item)),
	}));
}