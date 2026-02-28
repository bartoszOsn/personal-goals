import { Select, SelectProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';

export interface InplaceSelectEditProps
	extends SelectProps,
		Omit<ComponentPropsWithoutRef<'input'>, keyof SelectProps> {
	onValueSubmit?: (value: string | null) => void
}

export const InplaceSelectEdit = forwardRef<HTMLInputElement, InplaceSelectEditProps>(
	({ onValueSubmit, ...selectProps }, ref) => {
		const context = useContext(InplaceEditorContext);

		const mergedProps = mergeProps({
			onBlur: () => {
				context.onDisplay();
			},
			onKeyDown: (e) => {
				if (e.key === 'Enter') {
					context.onDisplay();
				}
				if (e.key === 'Escape') {
					context.onDisplay();
				}
			},
			onChange: (e) => {
				onValueSubmit?.(e);
				context.onDisplay();
			},
			autoFocus: true,
			defaultDropdownOpened: true
		}, selectProps);

		return <Select {...mergedProps} ref={ref} />;
	}
)