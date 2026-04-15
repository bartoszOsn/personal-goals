import { Group, useMantineTheme } from '@mantine/core';
import { GanttProps } from '@/base/gantt/GanttProps.ts';
import { GanttProvider } from '@/base/gantt/GanttProvider.tsx';
import { GanttTable } from '@/base/gantt/GanttTable.tsx';
import { GanttChart } from '@/base/gantt/GanttChart.tsx';
import { GanttDivider } from '@/base/gantt/GanttDivider';
import { RefObject, useRef } from 'react';
import { localStoragePropertyStorage } from '@/base/property-storage/localStoragePropertyStorage';
import { useMediaQuery } from '@mantine/hooks';

export function Gantt<TData>(props: GanttProps<TData>) {
	const propsWithDefaults = {
		...props,
		storage: props.storage ?? localStoragePropertyStorage
	}

	const rootContainerRef: RefObject<HTMLDivElement | null> = useRef(null);

	const theme = useMantineTheme();

	const hideChartQuery = useMediaQuery(`(max-width: ${props.hideChartWithScreenSmallerThan ? theme.breakpoints[props.hideChartWithScreenSmallerThan] : '100000px'})`);
	const hideChart = !!props.hideChartWithScreenSmallerThan && hideChartQuery;


	return (
		<GanttProvider props={propsWithDefaults} rootContainerRef={rootContainerRef}>
			<Group ref={rootContainerRef} {...propsWithDefaults.containerProps} gap={0} wrap='nowrap' flex='1 1 auto' mih='0'>
				<GanttTable />
				{
					!hideChart && (
						<>
							<GanttDivider />
							<GanttChart />
						</>
					)
				}
			</Group>
		</GanttProvider>
	);
}