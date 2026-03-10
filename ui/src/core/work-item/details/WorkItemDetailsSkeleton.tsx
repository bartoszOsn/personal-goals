import { Group, Skeleton, Stack } from '@mantine/core';

export function WorkItemDetailsSkeleton() {
	return (
		<Stack>
			<Group gap="xl">
				<Skeleton h={30} flex={1} />
				<Skeleton h={30} flex={1} />
				<Skeleton h={30} flex={1} />
			</Group>
			<Skeleton w='100%' h={100} />
		</Stack>
	)
}