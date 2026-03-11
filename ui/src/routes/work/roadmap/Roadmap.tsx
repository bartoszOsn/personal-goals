import { Group, Stack } from '@mantine/core';
import { RoadmapGantt } from '@/routes/work/roadmap/RoadmapGantt';

export function Roadmap({ context }: { context: number }) {
	return (
		<Stack w="100%" h="100vh" p="lg" style={{ overflow: 'hidden' }}>
			<Group>
				There will be some buttons
			</Group>
			<RoadmapGantt context={context} />
		</Stack>
	);
}