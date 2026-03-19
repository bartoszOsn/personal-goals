import { DocumentId } from '@/models/Document.ts';
import { useDocumentDetailsQuery, useUpdateDocumentMutation } from '@/api/document/document-hooks';
import { DocumentDetailsSkeleton } from '@/routes/work/document/DocumentDetailsSkeleton';
import { Stack, Text, Title } from '@mantine/core';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';
import { InplaceEditor } from '@/base/inplace-editor/api/InplaceEditor';
import { InplaceEditorDisplay } from '@/base/inplace-editor/api/InplaceEditorDisplay';
import { InplaceCustomDisplayWrapper } from '@/base/inplace-editor/api/primitive/display/InplaceCustomDisplayWrapper';
import { InplaceTextInputEdit } from '@/base/inplace-editor/api/primitive/edit/InplaceTextInputEdit';
import { InplaceEditorEdit } from '@/base/inplace-editor/api/InplaceEditorEdit';

export function DocumentDetails({ context, documentId }: { context: number, documentId: DocumentId }) {
	const detailsQuery = useDocumentDetailsQuery(documentId);
	const updateDocument = useUpdateDocumentMutation(context)

	if (detailsQuery.isPending || !detailsQuery.data) {
		return <DocumentDetailsSkeleton />;
	}

	if (detailsQuery.error) {
		if (detailsQuery.error.statusCode === 404) {
			return "Document Not Found";
		}
	}

	return <Stack gap='xl'>
		<InplaceEditor>
			<InplaceEditorDisplay>
				<InplaceCustomDisplayWrapper>
					<Title order={2}>{detailsQuery.data.name}</Title>
				</InplaceCustomDisplayWrapper>
			</InplaceEditorDisplay>
			<InplaceEditorEdit>
				<InplaceTextInputEdit size='xl' fw='bold' defaultValue={detailsQuery.data.name} onValueSubmit={(value) => updateDocument.mutateAsync({ [detailsQuery.data.id]: { name: value } }) } />
			</InplaceEditorEdit>
		</InplaceEditor>
		<RichTextEditor key={`rich-text-editor-document-details-${documentId}`} content={detailsQuery.data.description} placeholder={'Document content'} onChangeThrottle={(value) => updateDocument.mutate({ [detailsQuery.data.id]: { description: value } }) } />
		<Text c='dimmed' size='sm'>Updated at: {detailsQuery.data.editedAt.toLocaleString()}</Text>
	</Stack>
}