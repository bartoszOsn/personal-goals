import { TextInput, TextInputProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';

export interface InplaceTextInputEditProps
	extends TextInputProps,
	Omit<ComponentPropsWithoutRef<'input'>, keyof TextInputProps> {
	onValueSubmit?: (value: string) => void
}

export const InplaceTextInputEdit = forwardRef<HTMLInputElement, InplaceTextInputEditProps>(
	({ onValueSubmit, ...textInputProps }, ref) => {
		const context = useContext(InplaceEditorContext);

		const mergedProps = mergeProps({
			onBlur: (e) => {
				onValueSubmit?.(e.currentTarget.value);
				context.onDisplay();
			},
			onKeyDown: (e) => {
				if (e.key === 'Enter') {
					onValueSubmit?.(e.currentTarget.value);
					context.onDisplay();
				}
				if (e.key === 'Escape') {
					context.onDisplay();
				}
			},
			autoFocus: true,
		}, textInputProps);

		return <TextInput {...mergedProps} ref={ref} />;
	}
)