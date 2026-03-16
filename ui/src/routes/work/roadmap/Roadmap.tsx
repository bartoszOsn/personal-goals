import { Group, Stack } from '@mantine/core';
import { RoadmapGantt } from '@/routes/work/roadmap/RoadmapGantt';

export function Roadmap({ context }: { context: number }) {
	return (
		<Stack w="100%" h="calc(100vh - 50px)" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				There will be some buttons
			</Group>
			<RoadmapGantt context={context} />
		</Stack>
	);
}