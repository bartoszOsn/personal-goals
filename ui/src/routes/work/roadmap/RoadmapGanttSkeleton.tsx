import { Group, Skeleton, Stack } from '@mantine/core';

export function RoadmapGanttSkeleton() {
	return (
		<Group flex={1} align='flex-start'>
			<Stack flex={1} gap='xs' mah='100%' style={{ overflow: 'hidden' }}>
				{
					Array.from({ length: 30 }, (_, i) => <Skeleton key={i} w='100%' h={30} />)
				}
			</Stack>
			<Skeleton w='100%' h='100%' flex={2} />
		</Group>
	)
}