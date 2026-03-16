import { Box } from '@mantine/core';
import { getRouteApi } from '@tanstack/react-router';
import { DocumentId } from '@/models/Document';
import { DocumentDetails } from '@/routes/work/document/DocumentDetails';

export function DocumentRoute() {
	const documentId = getRouteApi('/work/$context/document/$documentId')
		.useParams({
			select: p => p.documentId as DocumentId
		});

	return (
		<Box p='xl' mih='calc(100vh - 50px)'>
			<DocumentDetails documentId={documentId} />
		</Box>
	)
}