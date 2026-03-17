import { DocumentId } from '@/models/Document.ts';
import { useDocumentDetailsQuery } from '@/api/document/document-hooks';
import { DocumentDetailsSkeleton } from '@/routes/work/document/DocumentDetailsSkeleton';
import { Stack, Title } from '@mantine/core';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';

export function DocumentDetails({ documentId }: { documentId: DocumentId }) {
	const detailsQuery = useDocumentDetailsQuery(documentId);

	if (detailsQuery.isPending || !detailsQuery.data) {
		return <DocumentDetailsSkeleton />;
	}

	if (detailsQuery.error) {
		if (detailsQuery.error.statusCode === 404) {
			return "Document Not Found";
		}
	}

	return <Stack gap='xl'>
		<Title order={2}>{detailsQuery.data.name}</Title>
		<RichTextEditor content={detailsQuery.data.description} placeholder={'Document content'} />
	</Stack>
}