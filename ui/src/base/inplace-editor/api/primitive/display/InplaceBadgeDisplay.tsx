import { Badge, BadgeProps } from '@mantine/core';
import { ComponentPropsWithoutRef, forwardRef, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps.ts';

export interface InplaceBadgeDisplayProps
	extends BadgeProps,
		Omit<ComponentPropsWithoutRef<'div'>, keyof BadgeProps> {
}

export const InplaceBadgeDisplay = forwardRef<HTMLInputElement, InplaceBadgeDisplayProps>(
	(badgeProps, ref) => {
		const context = useContext(InplaceEditorContext);

		const mergedProps = mergeProps({
			onClick: () => {
				context.onEdit();
			},
			style: { cursor: 'pointer' }
		}, badgeProps);

		return <Badge {...mergedProps} ref={ref} />;
	}
)