import type { ReactNode } from 'react';

export interface DataTypeEditorProps<TData> {
	value: TData;
	onCancel: () => void;
	onSubmit: () => void;
	onChange: (value: TData) => void;
}

export type DataTypeEditor<TData> = (props: DataTypeEditorProps<TData>) => ReactNode;