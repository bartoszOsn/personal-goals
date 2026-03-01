import { Group, Modal, Stack, Text } from '@mantine/core';
import { WorkItemModalSkeleton } from '@/core/WorkItemModalSkeleton.tsx';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor.tsx';
import { ObjectiveId } from '@/models/Objective.ts';
import { useObjectiveQuery, useOKRUpdateMutation } from '@/api/okr/okr-hooks';
import { ObjectiveNameInplace } from '@/core/objective/inplace/ObjectiveNameInplace';

export function ObjectiveModal({ objectiveId }: { objectiveId: ObjectiveId }) {
	const objectiveQuery = useObjectiveQuery(objectiveId);
	const updateObjectiveMutation = useOKRUpdateMutation();

	const onChangeObjectiveDescription = async (newDescription: string) => {
		await updateObjectiveMutation.mutateAsync({
			id: objectiveId,
			request: {
				description: newDescription
			}
		});
	};

	if (objectiveQuery.isPending || !objectiveQuery.data) {
		return <WorkItemModalSkeleton />;
	}

	return (
		<>
			<Modal.Header style={{ gap: 'var(--mantine-spacing-md)'}}>
				<Modal.Title flex={1}>
					<ObjectiveNameInplace objective={objectiveQuery.data}
									 textProps={{ inherit: false, size: 'xl' }}
									 inputProps={{ w: '100%' }} showDialogButton={false} />
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<Stack gap="xl">
					<Group gap="xl" align="flex-start">
						<Stack gap="xs">
							<Text size="sm" c="dimmed">Deadline</Text>
							{/*TODO: Inplace for deadline*/}
						</Stack>
						{/*TODO: Links to KR modals*/}
					</Group>
					<RichTextEditor content={objectiveQuery.data.description}
									placeholder="Description"
									onChangeThrottle={onChangeObjectiveDescription} />
				</Stack>
			</Modal.Body>
		</>
	);
}