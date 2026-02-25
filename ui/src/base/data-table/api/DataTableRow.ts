export interface DataTableRow<TData, TId> {
	id: TId;
	data: TData;
	children: DataTableRow<TData, TId>[];
}