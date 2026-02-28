import { ReactNode, useContext } from 'react';
import { InplaceEditorContext } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';

export interface InplaceEditorEditProps {
	children?: ReactNode;
}

export function InplaceEditorEdit(props: InplaceEditorEditProps) {
	const context = useContext(InplaceEditorContext);

	return context.state === 'edit'
		? props.children
		: null;
}