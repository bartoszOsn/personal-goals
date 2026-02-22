import { Stack } from '@mantine/core';

export function SprintOverview({ sprintId }: { sprintId: string }) {
	return (
		<Stack p="lg">
			SprintId: {sprintId}
		</Stack>
	)
}