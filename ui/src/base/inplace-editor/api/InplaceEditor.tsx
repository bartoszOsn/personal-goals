import { ReactNode, useCallback, useMemo, useState } from 'react';
import { InplaceEditorContext, InplaceEditorContextPayload } from '@/base/inplace-editor/internal/InplaceEditorContext.ts';
import { Skeleton } from '@mantine/core';

export interface InplaceEditorProps {
	loading?: boolean;
	children: ReactNode;
}

export function InplaceEditor(props: InplaceEditorProps) {
	const {
		loading = false,
		children
	} = props;

	const [state, setState] = useState<InplaceEditorContextPayload['state']>('display');
	
	const onEdit = useCallback(() => {
		setState('edit');
	}, []);
	
	const onDisplay = useCallback(() => {
		setState('display');
	}, []);
	
	const contextPayload: InplaceEditorContextPayload = useMemo(() => ({
		state,
		onEdit,
		onDisplay
	}), [onDisplay, onEdit, state]);

	return (
		<InplaceEditorContext.Provider value={contextPayload}>
			<Skeleton visible={loading}>
				<InplaceEditorContext.Provider value={contextPayload}>
					{children}
				</InplaceEditorContext.Provider>
			</Skeleton>
		</InplaceEditorContext.Provider>
	);
}