import { ReactNode, useContext } from 'react';
import { DialogId } from '@/base/dialog-manager/api/DialogId.ts';
import { DialogManagerContext } from '@/base/dialog-manager/internal/contexts.ts';
import { generateDialogId } from '@/base/dialog-manager/internal/generateDialogId.ts';

export function useDialogManager() {
	const context = useContext(DialogManagerContext);

	if (!context) {
		throw new Error('useDialogManager must be used inside a dialogManagerProvider.');
	}

	const openDialog = (dialogContent: ReactNode): DialogId => {
		const newId = generateDialogId();
		context.setDialogs(dialogs => ({ ...dialogs, [newId]: dialogContent }));
		return newId;
	}

	const closeDialog = (dialogId: DialogId) => {
		context.setDialogs(dialogs => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { [dialogId]: _, ...rest } = dialogs;
			return rest;
		});
	}

	const updateDialog = (id: DialogId, dialogContent: ReactNode) => {
		context.setDialogs(dialogs => ({ ...dialogs, [id]: dialogContent }));
	}

	return { openDialog, closeDialog, updateDialog };
}