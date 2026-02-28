import { Box, Text } from '@mantine/core';
import { ComponentProps, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { mergeProps } from '@/base/util/mergeProps';

export function InplaceTextDisplay(props: ComponentProps<typeof Text<'p'>>) {
	const context = useContext(InplaceEditorContext);

	const propsWithDefault = mergeProps({
		inherit: true
	}, props);

	return <Box onClick={context.onEdit} style={{ cursor: 'pointer' }}>
		<Text {...propsWithDefault} />
	</Box>
}
