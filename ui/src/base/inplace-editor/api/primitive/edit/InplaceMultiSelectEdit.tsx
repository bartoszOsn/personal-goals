import { MultiSelect, MultiSelectProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';

export interface InplaceMultiSelectEditProps
	extends MultiSelectProps,
		Omit<ComponentPropsWithoutRef<'input'>, keyof MultiSelectProps> {
	onValueSubmit?: (value: string[]) => void
}

export const InplaceMultiSelectEdit = forwardRef<HTMLInputElement, InplaceMultiSelectEditProps>(
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

		return <MultiSelect {...mergedProps} ref={ref} />;
	}
)