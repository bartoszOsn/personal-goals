import { RoadmapGantt } from '@/routes/work/roadmap/RoadmapGantt';
import { useState } from 'react';
import { WorkItemId } from '@/models/WorkItem';
import { RoadmapHeader } from '@/routes/work/roadmap/RoadmapHeader';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';

export function Roadmap({ context }: { context: number }) {
	const [selectedItemIds, setSelectedItemIds] = useState<WorkItemId[]>([]);

	return (
		<PageContent>
			<PageContentHeader>
				<RoadmapHeader context={context} selectedWorkItemIds={selectedItemIds} />
			</PageContentHeader>
			<PageContentContent>
				<RoadmapGantt context={context} onSelectedWorkItemsChange={setSelectedItemIds} />
			</PageContentContent>
		</PageContent>
	);
}