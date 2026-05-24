import { getRouteApi } from '@tanstack/react-router';
import { DocumentId } from '@/models/Document';
import { DocumentDetails } from '@/routes/work/document/DocumentDetails';
import { Temporal } from 'temporal-polyfill';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { DocumentDetailsHeader } from '@/routes/work/document/DocumentDetailsHeader';

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
		<PageContent>
			<PageContentHeader>
				<DocumentDetailsHeader context={context} documentId={documentId} />
			</PageContentHeader>
			<PageContentContent>
				<DocumentDetails context={context} documentId={documentId} />
			</PageContentContent>
		</PageContent>
	);
}