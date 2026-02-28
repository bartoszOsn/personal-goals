import { Box, Text } from '@mantine/core';
import { ComponentProps, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';

export function InplaceTextDisplay(props: ComponentProps<typeof Text<'p'>>) {
	const context = useContext(InplaceEditorContext);

	return <Box onClick={context.onEdit} style={{ cursor: 'pointer' }}>
		<Text {...props} />
	</Box>
}
