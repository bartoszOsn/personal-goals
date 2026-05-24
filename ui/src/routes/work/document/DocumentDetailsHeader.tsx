import { DocumentId } from '@/models/Document.ts';
import { InplaceInput } from '@/base/inplace/InplaceInput';
import { useDocumentDetailsQuery, useUpdateDocumentMutation } from '@/api/document/document-hooks';
import { Skeleton } from '@/primitive/components/ui/skeleton';

export function DocumentDetailsHeader({ context, documentId }: { context: number, documentId: DocumentId }) {
	const detailsQuery = useDocumentDetailsQuery(documentId);
	const updateDocument = useUpdateDocumentMutation(context);

	if (detailsQuery.isPending || !detailsQuery.data) {
		return <Skeleton className="w-full h-6" />
	}

	return (
		<p className='py-1 text-lg font-semibold tracking-tight'>
			<InplaceInput value={detailsQuery.data.name} onSubmit={async newTitle => {
				await updateDocument.mutateAsync({
					[detailsQuery.data.id]: {
						name: newTitle
					}
				});
			}} />
		</p>
	)
}