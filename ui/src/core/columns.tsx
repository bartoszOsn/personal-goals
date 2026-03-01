import { ColumnDescriptor } from '@/base/data-table';
import { WorkItemVariant } from '@/models/WorkItemVariant.ts';
import { TaskNameInplace } from '@/core/task/inplace/TaskNameInplace.tsx';
import { TaskStatusInplace } from '@/core/task/inplace/TaskStatusInplace.tsx';
import { TaskStartDateInplace } from '@/core/task/inplace/TaskStartDateInplace.tsx';
import { TaskEndDateInplace } from '@/core/task/inplace/TaskEndDateInplace.tsx';
import { TaskKeyResultInplace } from '@/core/task/inplace/TaskKeyResultInplace.tsx';
import { TaskSprintInplace } from '@/core/task/inplace/TaskSprintInplace.tsx';
import { mapWorkItemVariant } from '@/core/mapWorkItemVariant.ts';
import { Text } from '@mantine/core';

export const workItemCommonColumns: ColumnDescriptor<WorkItemVariant>[] = [
	{
		columnId: 'name',
		columnName: 'Name',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskNameInplace task={task} />,
			objective: (o) => <Text inherit>{o.name}</Text>,
			keyResult: (kr) => <Text inherit>{kr.name}</Text>,
		})
	},
]

export const taskColumns: ColumnDescriptor<WorkItemVariant>[] = [
	{
		columnId: 'status',
		columnName: 'Status',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskStatusInplace task={task} />,
			default: () => null
		})
	},
	{
		columnId: 'startDate',
		columnName: 'Start date',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskStartDateInplace task={task} />,
			default: () => null
		})
	},
	{
		columnId: 'endDate',
		columnName: 'End date',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskEndDateInplace task={task} />,
			default: () => null
		})
	},
	{
		columnId: 'keyResultId',
		columnName: 'Key result',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskKeyResultInplace task={task} />,
			default: () => null
		})
	},
	{
		columnId: 'sprints',
		columnName: 'Sprints',
		render: (variant) => mapWorkItemVariant(variant, {
			task: (task) => <TaskSprintInplace task={task} />,
			default: () => null
		})
	}
]