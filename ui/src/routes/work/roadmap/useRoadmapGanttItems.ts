import { useOkrQuery } from '@/api/okr-hooks.ts';
import { useTasksQuery } from '@/api/task/task-hooks.ts';
import { useMemo } from 'react';
import { GanttItem } from '@/base/gantt';
import { KeyResultDTO, ObjectiveDeadlineDTO, ObjectiveDTO } from '@personal-okr/shared';
import { Temporal } from 'temporal-polyfill';
import { Task } from '@/models/Task';

export function useRoadmapGanttItems() {
	const okrs = useOkrQuery();
	const tasksQuery = useTasksQuery();

	const objectives = okrs.data?.objectives ?? [];
	const tasks = tasksQuery.data ?? [];

	const ganttItems: GanttItem<ObjectiveDTO | KeyResultDTO | Task>[] = useMemo(() => {
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

function objectiveToGanttItem(objectiveDTO: ObjectiveDTO, tasks: Task[]): GanttItem<ObjectiveDTO | KeyResultDTO | Task> {
	const [start, end] = getDatesFromDeadline(objectiveDTO.deadline);

	return {
		id: objectiveDTO.id,
		color: 'grape',
		data: objectiveDTO,
		children: objectiveDTO.keyResults.map(kr => krToGanttItem(kr, tasks, objectiveDTO)),
		start,
		end,
		linksInto: []
	};
}

function krToGanttItem(keyResultDTO: KeyResultDTO, tasks: Task[], parent: ObjectiveDTO): GanttItem<ObjectiveDTO | KeyResultDTO | Task> {
	const [start, end] = getDatesFromDeadline(parent.deadline);

	return {
		id: keyResultDTO.id,
		color: 'orange',
		data: keyResultDTO,
		children: keyResultDTO.associatedTaskIds.map(taskId => tasks.find(t => t.id === taskId))
			.filter((task): task is Task => task !== undefined)
			.map(taskToGanttItem),
		start,
		end,
		linksInto: []
	};
}

function taskToGanttItem(task: Task): GanttItem<ObjectiveDTO | KeyResultDTO | Task> {
	return {
		id: task.id,
		color: 'gray',
		data: task,
		start: task.startDate ?? undefined,
		end: task.endDate ?? undefined,
		children: [],
		linksInto: []
	};
}

function getDatesFromDeadline(deadline: ObjectiveDeadlineDTO): [start: Temporal.PlainDate, end: Temporal.PlainDate] {
	if (!deadline.quarter) {
		return [Temporal.PlainDate.from(`${deadline.year}-01-01`), Temporal.PlainDate.from(`${deadline.year}-12-31`)];
	}

	const start = Temporal.PlainDate.from(`${deadline.year}-01-01`);
	const end = Temporal.PlainDate.from(`${deadline.year}-12-31`); // TODO: work with quarters
	return [start, end];
}