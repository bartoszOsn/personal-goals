import { Box } from '@mantine/core';
import { ComponentProps, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps';

export function InplaceCustomDisplayWrapper(props: ComponentProps<typeof Box<'div'>>) {
	const context = useContext(InplaceEditorContext);

	const propsWithDefault = mergeProps({
		onClick: context.onEdit,
		style: { cursor: 'pointer' },
	}, props);

	return <Box {...propsWithDefault} />
}
