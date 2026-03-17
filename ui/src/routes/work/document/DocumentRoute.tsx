import { Box } from '@mantine/core';
import { getRouteApi } from '@tanstack/react-router';
import { DocumentId } from '@/models/Document';
import { DocumentDetails } from '@/routes/work/document/DocumentDetails';
import { Temporal } from 'temporal-polyfill';

export function DocumentRoute() {
	const context = getRouteApi('/work/$context/document/$documentId')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});
	const documentId = getRouteApi('/work/$context/document/$documentId')
		.useParams({
			select: p => p.documentId as DocumentId
		});

	return (
		<Box p='xl' mih='calc(100vh - 50px)'>
			<DocumentDetails context={context} documentId={documentId} />
		</Box>
	)
}