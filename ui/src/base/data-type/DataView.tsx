import type { DataType } from '@/base/data-type/DataType.ts';
import { useEffect, useState } from 'react';

export interface DataViewProps<TData> {
	value: TData;
	onChange: (value: TData) => void;
	dataType: DataType<TData>
}

export function DataView<TData>(props: DataViewProps<TData>) {
	const [editing, setEditing] = useState(false);
	const [editedValue, setEditedValue] = useState<TData>(props.value);

	useEffect(() => {
		setEditedValue(props.value);
	}, [props.value]);

	const value = props.value;
	const onCancelEditing = () => {
		setEditing(false);
		setEditedValue(props.value);
	}
	const onChange = (value: TData) => {
		setEditedValue(value);
	}
	const onSubmit = () => {
		props.onChange(editedValue);
		setEditing(false);
		setEditedValue(value);
	}

	return (
		<>
			{
				editing ? (
					<props.dataType.Editor value={editedValue}
										   onCancel={onCancelEditing}
										   onChange={onChange}
										   onSubmit={onSubmit}/>
				) : (
					<props.dataType.Presenter value={value}
											  onEdit={() => setEditing(true)} />
				)
			}
		</>
	);
}

export default DataView;