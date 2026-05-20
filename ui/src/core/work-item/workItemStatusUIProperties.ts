import { WorkItemStatus } from '@/models/WorkItem.ts';
import { CircleCheckIcon, CircleDashedIcon, CircleDotIcon, CircleXIcon, LucideIcon } from 'lucide-react';

export const workItemStatusUIProperties: Record<WorkItemStatus, {
	label: string,
	icon: LucideIcon,
	iconTextClass: string
}> = {
	[WorkItemStatus.TODO]: {
		label: 'To do',
		icon: CircleDashedIcon,
		iconTextClass: 'text-muted-foreground'
	},
	[WorkItemStatus.IN_PROGRESS]: {
		label: 'In progress',
		icon: CircleDotIcon,
		iconTextClass: 'text-blue-500'
	},
	[WorkItemStatus.FAILED]: {
		label: 'Failed',
		icon: CircleXIcon,
		iconTextClass: 'text-red-500'
	},
	[WorkItemStatus.DONE]: {
		label: 'Done',
		icon: CircleCheckIcon,
		iconTextClass: 'text-green-500'
	}
}