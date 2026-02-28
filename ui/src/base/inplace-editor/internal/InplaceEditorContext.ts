import { createContext } from 'react';

export interface InplaceEditorContextPayload {
	state: 'display' | 'edit';
	onEdit: () => void;
	onDisplay: () => void;
}

export const InplaceEditorContext = createContext<InplaceEditorContextPayload>({
	state: 'display',
	onEdit: () => {},
	onDisplay: () => {}
});