import { Skeleton, Stack } from '@mantine/core';

export function DocumentDetailsSkeleton() {
	return (
		<Stack gap='xl' h='100%'>
			<Skeleton w='100%' h={60} />
			<Skeleton w='100%' flex={1} />
		</Stack>
	)
}