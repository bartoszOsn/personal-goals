import { Sprint } from '@/models/Sprint.ts';
import { ComponentProps } from 'react';
import { InplaceTextDisplay } from '@/base/inplace-editor/api/primitive/display/InplaceTextDisplay.tsx';
import { InplacePlainDateEdit } from '@/base/inplace-editor/api/primitive/edit/InplacePlainDateEdit.tsx';
import { useUpdateSprintsMutation } from '@/api/sprint/sprint-hooks.ts';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor.tsx';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay.tsx';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit.tsx';
import { Temporal } from 'temporal-polyfill';

export interface SprintStartDateInplaceProps {
	sprint: Sprint;
	textProps?: ComponentProps<typeof InplaceTextDisplay>
	inputProps?: ComponentProps<typeof InplacePlainDateEdit>;
}

export function SprintStartDateInplace({sprint, textProps, inputProps}: SprintStartDateInplaceProps) {
	const sprintMutation = useUpdateSprintsMutation(sprint.year);

	const onValueSubmit = (value: Temporal.PlainDate | null) => {
		sprintMutation.mutate({
			[sprint.id]: {
				newStartDate: value!,
				newEndDate: sprint.endDate
			}
		})
	}

	return (
		<InplaceEditor loading={sprintMutation.isPending}>
			<InplaceEditorDisplay>
				<InplaceTextDisplay {...textProps}>{sprint.startDate.toLocaleString()}</InplaceTextDisplay>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplacePlainDateEdit {...inputProps} defaultValue={sprint.startDate.toJSON()} clearable={false} onValueSubmit={onValueSubmit} />
			</InplaceEditorEdit>
		</InplaceEditor>
	)
}