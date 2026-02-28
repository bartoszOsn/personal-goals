import { DataType } from '@/base/data-type';
import { Temporal } from 'temporal-polyfill';
import { FocusTrap, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';

export const plainDateDataType: DataType<Temporal.PlainDate | null> = {
	Presenter: ({ value, onEdit }) => (
		value === null
			? <Text onClick={onEdit} c='gray' inherit style={{ cursor: onEdit ? 'pointer' : 'default' }}>No date</Text>
			: <Text onClick={onEdit} inherit style={{ cursor: onEdit ? 'pointer' : 'default' }}>{value?.toLocaleString() ?? ''}</Text>
	),
	Editor: ({ value, onCancel, onChange, onSubmit }) => (
		<FocusTrap>
			<DateInput value={value?.toJSON()}
					   size="xs"
					   clearable
					   onBlur={() => onSubmit(value)}
					   onChange={(e) => onChange(e === null ? null : Temporal.PlainDate.from(e))}
					   onKeyDown={(e) => {
						   if (e.key === 'Enter') {
							   onSubmit(value);
						   }
						   if (e.key === 'Escape') {
							   onCancel();
						   }
					   }} />
		</FocusTrap>
	)
}