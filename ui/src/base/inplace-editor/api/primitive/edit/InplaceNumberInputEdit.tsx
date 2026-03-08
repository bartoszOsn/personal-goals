import { NumberInput, NumberInputProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';

export interface InplaceNumberInputEditProps
	extends NumberInputProps,
	Omit<ComponentPropsWithoutRef<'input'>, keyof NumberInputProps> {
	onValueSubmit?: (value: number) => void
}

export const InplaceNumberInputEdit = forwardRef<HTMLInputElement, InplaceNumberInputEditProps>(
	({ onValueSubmit, ...numberInputProps }, ref) => {
		const context = useContext(InplaceEditorContext);

		const getNumberValue = (elem: HTMLInputElement) => {
			const num = Number(elem.value);
			if (isNaN(num)) {
				return 0;
			}
			return num;
		}

		const mergedProps = mergeProps({
			onBlur: (e) => {
				onValueSubmit?.(getNumberValue(e.currentTarget));
				context.onDisplay();
			},
			onKeyDown: (e) => {
				if (e.key === 'Enter') {
					onValueSubmit?.(getNumberValue(e.currentTarget));
					context.onDisplay();
				}
				if (e.key === 'Escape') {
					context.onDisplay();
				}
			},
			autoFocus: true,
		}, numberInputProps);

		return <NumberInput {...mergedProps} ref={ref} />;
	}
)