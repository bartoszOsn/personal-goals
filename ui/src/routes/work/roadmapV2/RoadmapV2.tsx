import { Group, Stack } from '@mantine/core';
import { RoadmapV2Gantt } from '@/routes/work/roadmapV2/RoadmapV2Gantt';

export function RoadmapV2({ context }: { context: number }) {
	return (
		<Stack w="100%" h="100vh" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				There will be some buttons
			</Group>
			<RoadmapV2Gantt context={context} />
		</Stack>
	);
}