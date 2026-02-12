import { Stack, Title } from '@mantine/core';
import { Gantt, type GanttItem } from '@/base/gantt';

export function SprintSettingsRoute() {
	const ganntItems: GanttItem<void>[] = [
		{
			id: '1',
			name: 'Sprint 1',
			start: new Date('2023-01-01'),
			end: new Date('2023-01-31'),
			color: 'green',
			data: undefined,
			linksInto: []
		},
		{
			id: '2',
			name: 'Sprint 2',
			start: new Date('2023-02-01'),
			end: new Date('2023-02-28'),
			color: 'blue',
			data: undefined,
			linksInto: []
		},
		{
			id: '3',
			name: 'Sprint 3',
			start: new Date('2023-03-01'),
			end: new Date('2023-03-31'),
			color: 'red',
			data: undefined,
			linksInto: []
		},
		{
			id: '4',
			name: 'Sprint 4',
			start: new Date('2023-04-01'),
			end: new Date('2023-04-30'),
			color: 'yellow',
			data: undefined,
			linksInto: []
		},
		{
			id: '5',
			name: 'Sprint 5',
			start: new Date('2023-05-01'),
			end: new Date('2023-05-31'),
			color: 'green',
			data: undefined,
			linksInto: []
		},
		{
			id: '6',
			name: 'Sprint 6',
			start: new Date('2023-06-01'),
			end: new Date('2023-06-30'),
			color: 'blue',
			data: undefined,
			linksInto: []
		},
		{
			id: '7',
			name: 'Sprint 7',
			start: new Date('2023-07-01'),
			end: new Date('2023-07-31'),
			color: 'red',
			data: undefined,
			linksInto: []
		},
		{
			id: '8',
			name: 'Sprint 8',
			start: new Date('2023-08-01'),
			end: new Date('2023-08-31'),
			color: 'yellow',
			data: undefined,
			linksInto: []
		},
		{
			id: '9',
			name: 'Sprint 9',
			start: new Date('2023-08-01'),
			end: new Date('2023-08-31'),
			color: 'yellow',
			data: undefined,
			linksInto: []
		}
	];

	return (
		<Stack w='100%' h='100vh' style={{ overflow: 'hidden' }}>
			<Title>Sprint Settings</Title>
			<Gantt items={ganntItems} containerProps={{ w: '100%', style: { flexGrow: 1, flexShrink: 0 } }} />
		</Stack>
	)
}