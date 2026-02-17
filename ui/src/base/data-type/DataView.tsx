import type { DataType } from '@/base/data-type/DataType.ts';
import { useEffect, useState } from 'react';
import { Skeleton } from '@mantine/core';

export interface DataViewProps<TData> {
	value: TData;
	onChange: (value: TData) => void | Promise<void>;
	dataType: DataType<TData>
}

export function DataView<TData>(props: DataViewProps<TData>) {
	const [state, setState] = useState<'pending' | 'editing' | 'presenting'>('presenting');
	const [editedValue, setEditedValue] = useState<TData>(props.value);

	useEffect(() => {
		setEditedValue(props.value);
	}, [props.value]);

	const value = props.value;
	const onCancelEditing = () => {
		setState('presenting');
		setEditedValue(props.value);
	}
	const onChange = (value: TData) => {
		setEditedValue(value);
	}
	const onSubmit = (value: TData) => {
		const result = props.onChange(value);
		setState('pending');
		Promise.resolve(result)
			.finally(() => {
				setState('presenting');
				setEditedValue(value);
			});
	}

	return (
		<>
			{
				state === 'editing' && (
					<props.dataType.Editor value={editedValue}
										   onCancel={onCancelEditing}
										   onChange={onChange}
										   onSubmit={onSubmit}/>
				)
			}
			{
				state === 'presenting' && (
					<props.dataType.Presenter value={value}
											  onEdit={() => setState('editing')} />
				)
			}
			{
				state === 'pending' && (
					<Skeleton w='100%' h='100%' mih='30px' />
				)
			}
		</>
	);
}
