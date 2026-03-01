import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit.tsx';
import { ComponentProps } from 'react';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons-react';
import { useKeyResultUpdateMutation } from '@/api/okr/okr-hooks.ts';
import { KeyResult } from '@/models/KeyResult.ts';

export interface KeyResultNameInplaceProps {
	keyResult: KeyResult;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplaceTextInputEdit>;
	showDialogButton?: boolean;
}

export function KeyResultNameInplace({ keyResult, textProps, inputProps, showDialogButton = true }: KeyResultNameInplaceProps) {
	const keyResultMutation = useKeyResultUpdateMutation();

	const onValueSubmit = (value: string) => {
		keyResultMutation.mutate({
			id: keyResult.id,
			request: {
				name: value,
			}
		});
	}

	return (
		<InplaceEditor loading={keyResultMutation.isPending}>
			<InplaceEditorDisplay>
				<Group gap='xs' wrap='nowrap' style={{ overflow: 'hidden' }}>
					{
						showDialogButton && (
							<Tooltip label='Open key result'>
								<ActionIcon size='xs' color='orange' variant='subtle' onClick={() => {}}>
									<IconFileInvoice />
								</ActionIcon>
							</Tooltip>
						)
					}
					<InplaceTextDisplay {...textProps}>{keyResult.name}</InplaceTextDisplay>
				</Group>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit {...inputProps} defaultValue={keyResult.name} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}