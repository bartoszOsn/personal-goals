import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { Temporal } from 'temporal-polyfill';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';
import { DateInput, DateInputProps } from '@mantine/dates';

export interface InplacePlainDateEditProps
	extends DateInputProps,
		Omit<ComponentPropsWithoutRef<'input'>, keyof DateInputProps> {
	onValueSubmit?: (value: Temporal.PlainDate | null) => void
}

export const InplacePlainDateEdit = forwardRef<HTMLInputElement, InplacePlainDateEditProps>(
	({ onValueSubmit, ...dateInputProps }, ref) => {
		const context = useContext(InplaceEditorContext);

		const mergedProps = mergeProps({
			onBlur: (e) => {
				onValueSubmit?.(!e.currentTarget.value ? null : Temporal.PlainDate.from(e.currentTarget.value));
				context.onDisplay();
			},
			onKeyDown: (e) => {
				if (e.key === 'Enter') {
					onValueSubmit?.(!e.currentTarget.value ? null : Temporal.PlainDate.from(e.currentTarget.value));
					context.onDisplay();
				}
				if (e.key === 'Escape') {
					context.onDisplay();
				}
			},
			autoFocus: true,
			valueFormat: 'YYYY-MM-DD',
			allowDeselect: true
		}, dateInputProps);

		return <DateInput {...mergedProps} ref={ref} />;
	}
)