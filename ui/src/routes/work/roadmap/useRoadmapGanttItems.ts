import { useOkrQuery } from '@/api/okr/okr-hooks.ts';
import { useTasksQuery } from '@/api/task/task-hooks.ts';
import { useMemo } from 'react';
import { GanttItem } from '@/base/gantt';
import { Temporal } from 'temporal-polyfill';
import { Task } from '@/models/Task';
import { Objective, ObjectiveDeadline } from '@/models/Objective';
import { KeyResult } from '@/models/KeyResult';
import { WorkItemVariant } from '@/models/WorkItemVariant';

export function useRoadmapGanttItems() {
	const okrs = useOkrQuery();
	const tasksQuery = useTasksQuery();

	const objectives = okrs.data ?? [];
	const tasks = tasksQuery.data ?? [];

	const ganttItems: GanttItem<WorkItemVariant>[] = useMemo(() => {
		return [
			...objectives.map((o) => objectiveToGanttItem(o, tasks)),
			...tasks.filter(task => !task.keyResultId).map(taskToGanttItem)
		];
	}, [objectives, tasks]);

	return {
		loading: okrs.isPending || tasksQuery.isPending,
		ganttItems
	}
}

function objectiveToGanttItem(objectiveDTO: Objective, tasks: Task[]): GanttItem<WorkItemVariant> {
	const [start, end] = getDatesFromDeadline(objectiveDTO.deadline);

	return {
		id: objectiveDTO.id,
		color: 'grape',
		data: { objective: objectiveDTO },
		children: objectiveDTO.KeyResults.map(kr => krToGanttItem(kr, tasks, objectiveDTO)),
		start,
		end,
		linksInto: []
	};
}

function krToGanttItem(keyResultDTO: KeyResult, tasks: Task[], parent: Objective): GanttItem<WorkItemVariant> {
	const [start, end] = getDatesFromDeadline(parent.deadline);

	return {
		id: keyResultDTO.id,
		color: 'orange',
		data: { keyResult: keyResultDTO },
		children: keyResultDTO.associatedTaskIds.map(taskId => tasks.find(t => t.id === taskId))
			.filter((task): task is Task => task !== undefined)
			.map(taskToGanttItem),
		start,
		end,
		linksInto: []
	};
}

function taskToGanttItem(task: Task): GanttItem<WorkItemVariant> {
	return {
		id: task.id,
		color: 'gray',
		data: { task: task },
		start: task.startDate ?? undefined,
		end: task.endDate ?? undefined,
		children: [],
		linksInto: []
	};
}

function getDatesFromDeadline(deadline: ObjectiveDeadline): [start: Temporal.PlainDate, end: Temporal.PlainDate] {
	if (!deadline.quarter) {
		return [Temporal.PlainDate.from(`${deadline.year}-01-01`), Temporal.PlainDate.from(`${deadline.year}-12-31`)];
	}

	const start = Temporal.PlainDate.from(`${deadline.year}-01-01`);
	const end = Temporal.PlainDate.from(`${deadline.year}-12-31`); // TODO: work with quarters
	return [start, end];
}