import { Center, Text } from '@mantine/core';

export function RoadmapV2Gantt({ context }: { context: number }) {
	return <Center flex={1} bd='1px solid black'>
		<Text>Roadmap V2 Gantt for year {context}</Text>
	</Center>
}