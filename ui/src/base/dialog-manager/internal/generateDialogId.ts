import { DialogId } from '@/base/dialog-manager/api/DialogId.ts';

let nextModalId = 0;
export function generateDialogId(): DialogId {
	return `modal-${nextModalId++}` as DialogId;
}