import { Group } from '@mantine/core';
import { GanttProps } from '@/base/gantt/GanttProps.ts';
import { GanttProvider } from '@/base/gantt/GanttProvider.tsx';
import { GanttTable } from '@/base/gantt/GanttTable.tsx';
import { GanttChart } from '@/base/gantt/GanttChart.tsx';

export function Gantt<TData>(props: GanttProps<TData>) {
	return (
		<GanttProvider props={props}>
			<Group {...props.containerProps} wrap='nowrap' flex='1 1 auto' mih='0'>
				<GanttTable />
				<GanttChart />
			</Group>
		</GanttProvider>
	);
}