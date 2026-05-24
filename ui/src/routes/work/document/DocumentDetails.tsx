import { DocumentId } from '@/models/Document.ts';
import { useDocumentDetailsQuery, useUpdateDocumentMutation } from '@/api/document/document-hooks';
import { RichTextEditor } from '@/base/rich-text/RichTextEditor';
import { Skeleton } from '@/primitive/components/ui/skeleton';

export function DocumentDetails({ context, documentId }: { context: number, documentId: DocumentId }) {
	const detailsQuery = useDocumentDetailsQuery(documentId);
	const updateDocument = useUpdateDocumentMutation(context);

	if (detailsQuery.isPending || !detailsQuery.data) {
		return <Skeleton className='w-full h-96' />
	}

	if (detailsQuery.error) {
		if (detailsQuery.error.statusCode === 404) {
			return "Document Not Found";
		}
	}

	return <div className='flex flex-col gap-4'>
		<RichTextEditor key={`rich-text-editor-document-details-${documentId}`} content={detailsQuery.data.description} placeholder={'Document content'} onChangeThrottle={(value) => updateDocument.mutate({ [detailsQuery.data.id]: { description: value } }) } />
		<p className='text-muted-foreground text-sm'>Updated at: {detailsQuery.data.editedAt.toLocaleString()}</p>
	</div>
}