import { ReactNode, useContext } from 'react';
import { DialogManagerDialogIdContext } from '@/base/dialog-manager/internal/contexts.ts';
import { useDialogManager } from '@/base/dialog-manager/api/useDialogManager.ts';

export function useCurrentDialog() {
	const dialogId = useContext(DialogManagerDialogIdContext);
	const {
		updateDialog,
		closeDialog
	} = useDialogManager();

	if (!dialogId) {
		throw new Error('useCurrentDialog can only be invoked inside a component in Dialog opened by dialog manager.');
	}

	const closeCurrentDialog = () => closeDialog(dialogId);
	const updateCurrentDialog = (newContent: ReactNode) => updateDialog(dialogId, newContent);

	return { closeCurrentDialog, updateCurrentDialog };
}