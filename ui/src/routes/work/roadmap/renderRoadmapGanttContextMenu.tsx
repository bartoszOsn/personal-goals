import { GanttItem } from '@/base/gantt';
import { WorkItem } from '@/models/WorkItem';
import { RoadmapGanttContextMenu } from '@/routes/work/roadmap/RoadmapGanttContextMenu';

export function renderRoadmapGanttContextMenu(clickedOn: GanttItem<WorkItem>, selected: GanttItem<WorkItem>[], context: number) {
	return <RoadmapGanttContextMenu clickedOn={clickedOn} selected={selected} context={context} />;
}
