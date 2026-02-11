import { Group } from '@mantine/core';
import type { GanttProps } from '@/base/gantt/GanttProps.ts';
import { GanttProvider } from '@/base/gantt/GanttProvider.tsx';
import { GanttTable } from '@/base/gantt/GanttTable.tsx';
import { GanttChart } from '@/base/gantt/GanttChart.ts';

export function Gantt<TData>(props: GanttProps<TData>) {
	return (
		<GanttProvider props={props}>
			<Group>
				<GanttTable />
				<GanttChart />
			</Group>
		</GanttProvider>
	);
}