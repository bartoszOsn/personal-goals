import { ComponentPropsWithoutRef } from 'react';
import { WorkItem, WorkItemType } from '@/models/WorkItem.ts';
import { useWorkItemDetailsModal } from '@/core/work-item/details/useWorkItemDetailsModal.tsx';
import { GroupIcon, LucideProps, SquareCheckIcon, TargetIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/primitive/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/primitive/components/ui/tooltip';
import { workItemTypeToLabel } from '@/core/work-item/workItemTypeToLabel';

export function WorkItemModalTrigger({ context, workItem, ...buttonProps }: { context: number, workItem: WorkItem } & Omit<ComponentPropsWithoutRef<typeof Button>, 'children'>) {
	const openModal = useWorkItemDetailsModal();

	const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (e.button === 0) {
			e.preventDefault();
			openModal(workItem.id);
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger>
				<Button asChild size='icon' {...buttonProps}>
					<Link onClick={onClick} to={'/work/$context/details/$workItemId'} params={{ context: context.toString(), workItemId: workItem.id }} target='_blank'>
						<WorkItemModalTriggerIcon workItem={workItem} />
					</Link>
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				{workItemTypeToLabel[workItem.type]}
			</TooltipContent>
		</Tooltip>
	);
}

export function WorkItemModalTriggerIcon({ workItem, ...lucideProps }: { workItem: WorkItem } & Omit<LucideProps, "ref">) {
	switch (workItem.type) {
		case WorkItemType.TASK:
			return <SquareCheckIcon {...lucideProps} />
		case WorkItemType.GOAL:
			return <TargetIcon {...lucideProps} />
		case WorkItemType.GROUP:
			return <GroupIcon {...lucideProps} />
		default:
			return null;
	}
}