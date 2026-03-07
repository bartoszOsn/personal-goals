import { Group, Stack } from '@mantine/core';
import { RoadmapV2Gantt } from '@/routes/work/roadmapV2/RoadmapV2Gantt';
import { RoadmapContextSwitcher } from '@/routes/work/roadmapV2/RoadmapContextSwitcher';

export function RoadmapV2({ context, setContext }: { context: number, setContext: (context: number) => void }) {
	return (
		<Stack w="100%" h="100vh" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				<RoadmapContextSwitcher context={context} setContext={setContext} />
			</Group>
			<RoadmapV2Gantt context={context} />
		</Stack>
	);
}