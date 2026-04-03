import { Stack } from '@mantine/core';
import { RoadmapGantt } from '@/routes/work/roadmap/RoadmapGantt';
import { useState } from 'react';
import { WorkItemId } from '@/models/WorkItem';
import { RoadmapHeader } from '@/routes/work/roadmap/RoadmapHeader';

export function Roadmap({ context }: { context: number }) {
	const [selectedItemIds, setSelectedItemIds] = useState<WorkItemId[]>([]);

	return (
		<Stack w="100%" h="calc(100vh - 50px)" gap='xs' p="lg" style={{ overflow: 'hidden' }}>
			<RoadmapHeader context={context} selectedWorkItemIds={selectedItemIds} />
			<RoadmapGantt context={context} onSelectedWorkItemsChange={setSelectedItemIds} />
		</Stack>
	);
}