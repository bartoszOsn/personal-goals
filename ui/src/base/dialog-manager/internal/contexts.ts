import { createContext, Dispatch, ReactNode, SetStateAction } from 'react';
import { DialogId } from '@/base/dialog-manager/api/DialogId.ts';

export const DialogManagerContext = createContext<{ dialogs: Record<DialogId, ReactNode>, setDialogs: Dispatch<SetStateAction<Record<DialogId, ReactNode>>> } | null>(null);
export const DialogManagerDialogIdContext = createContext<DialogId | null>(null);
