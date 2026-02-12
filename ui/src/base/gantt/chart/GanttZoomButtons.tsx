import { Box, Button } from '@mantine/core';
import { headerCellHeight, headerRowYMargin } from '@/base/gantt/chart/GanttChartHeader';
import { useGanttContext } from '@/base/gantt/GanttProvider';
import { zoomLevels } from '@/base/gantt/zoomLevels';

export function GanttZoomButtons() {
	const context = useGanttContext();
	const zoomLevel = context.zoomLevel;
	const index = zoomLevels.indexOf(zoomLevel);
	const canZoomOut = index > 0;
	const canZoomIn = index < zoomLevels.length - 1;

	const zoomOut = () => {
		context.setZoomLevel(zoomLevels[index - 1]);
	}

	const zoomIn = () => {
		context.setZoomLevel(zoomLevels[index + 1]);
	}

	return (
		<Box pos='absolute' top={headerCellHeight * 2 + headerRowYMargin * 3} right={16}>
			<Button.Group>
				<Button variant="light"
						color="gray"
						size="compact-xs"
						disabled={!canZoomOut}
						onClick={zoomOut}>-</Button>
				<Button variant="light"
						color="gray"
						size="compact-xs"
						disabled={!canZoomIn}
						onClick={zoomIn}>+</Button>
			</Button.Group>
		</Box>
	)
}