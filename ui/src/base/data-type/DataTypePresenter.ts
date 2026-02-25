import type { ReactNode } from 'react';

export interface DataTypePresenterProps<TData> {
	value: TData;
	onEdit?: () => void;
}

export type DataTypePresenter<TData> = (props: DataTypePresenterProps<TData>) => ReactNode;