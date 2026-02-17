import type { DataType } from '@/base/data-type';
import { FocusTrap, Text, TextInput } from '@mantine/core';

export const stringDataType: DataType<string> = {
	Presenter: ({ value, onEdit }) => (
		<Text onClick={onEdit} inherit style={{ cursor: 'pointer' }}>{value}</Text>
	),
	Editor: ({ value, onCancel, onChange, onSubmit }) => (
		<FocusTrap>
			<TextInput value={value}
					   size="xs"
					   onBlur={onSubmit}
					   onInput={(e) => onChange(e.currentTarget.value)}
					   onKeyDown={(e) => {
						   if (e.key === 'Enter') {
							   onSubmit();
						   }
						   if (e.key === 'Escape') {
							   onCancel();
						   }
					   }} />
		</FocusTrap>
	)
};
