import { ReactNode, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';

export interface InplaceEditorDisplayProps {
	children?: ReactNode;
}

export function InplaceEditorDisplay(props: InplaceEditorDisplayProps) {
	const context = useContext(InplaceEditorContext);

	return context.state === 'display'
		? props.children
		: null;
}