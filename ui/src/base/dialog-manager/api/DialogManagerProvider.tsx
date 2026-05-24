import { ReactNode, useState } from 'react';
import { DialogId } from '@/base/dialog-manager/api/DialogId.ts';
import { DialogManagerContext, DialogManagerDialogIdContext } from '@/base/dialog-manager/internal/contexts.ts';
import { Dialog } from '@/primitive/components/ui/dialog.tsx';

export function DialogManagerProvider({ children }: { children: ReactNode }) {
	const [dialogs, setDialogs] = useState<Record<DialogId, ReactNode>>({});

	return (
		<DialogManagerContext.Provider value={{ dialogs, setDialogs }}>
			{children}

			{
				Object.entries(dialogs).map(([dialogId, dialog]) => (
					<DialogManagerDialogIdContext.Provider key={dialogId} value={dialogId as DialogId}>
						<Dialog open={true} onOpenChange={(open: boolean) => {
							if (!open) {
								// eslint-disable-next-line @typescript-eslint/no-unused-vars
								setDialogs(({ [dialogId as DialogId]: _, ...rest}) => rest)
							}
						}}>
							{dialog}
						</Dialog>
					</DialogManagerDialogIdContext.Provider>
				))
			}
		</DialogManagerContext.Provider>
	)
}