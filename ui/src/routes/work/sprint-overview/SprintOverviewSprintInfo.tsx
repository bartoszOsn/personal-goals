import { useSprintQuery } from '@/api/sprint/sprint-hooks.ts';
import { Temporal } from 'temporal-polyfill';
import { SprintId, SprintStatus } from '@/models/Sprint.ts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/primitive/components/ui/card.tsx';
import { Field, FieldLabel } from '@/primitive/components/ui/field.tsx';
import { Progress } from '@/primitive/components/ui/progress.tsx';
import { Badge } from '@/primitive/components/ui/badge.tsx';
import { ArrowBigRight, CheckIcon, CircleDotDashed } from 'lucide-react';
import { Skeleton } from '@/primitive/components/ui/skeleton.tsx';

export function SprintOverviewSprintInfo({ context, sprintId }: { context: number, sprintId: SprintId }) {
	const sprintQuery = useSprintQuery(context);
	const currentSprint = sprintQuery.data?.find(s => s.id === sprintId);

	if (sprintQuery.isPending || !currentSprint) {
		return <Skeleton className='w-full h-30' />
	}

	const start = currentSprint.startDate;
	const end = currentSprint.endDate;

	const timeStatus = currentSprint.status;
	const sinceStart = Temporal.Now.plainDateISO().since(start).total('days') + 1;
	const untilEnd = Temporal.Now.plainDateISO().until(end).total('days');
	const daysInSprint = start.until(end).total('days') + 1;
	const progress = Math.round(Math.max(Math.min((sinceStart - 1) / daysInSprint * 100, 100), 0));

	const badgeText = timeStatus === SprintStatus.COMPLETED
		? 'Completed'
		: timeStatus === SprintStatus.FUTURE
			? 'Future'
			: `${untilEnd} days left`;

	const badgeIcon = timeStatus === SprintStatus.COMPLETED
		? <CheckIcon className="text-green-500" data-icon="inline-start" />
		: timeStatus === SprintStatus.FUTURE
			? <ArrowBigRight className='text-muted-foreground' data-icon="inline-start" />
			: <CircleDotDashed className='text-blue-500' data-icon="inline-start" />

	return (
		<Card className='mb-4'>
			<CardHeader>
				<CardTitle className='text-center'>{ currentSprint.name }</CardTitle>
				<CardDescription className='text-center'>{start.toLocaleString()} → {end.toLocaleString()}</CardDescription>
			</CardHeader>
			<CardContent>
				<Field className="w-full mb-4">
					<FieldLabel htmlFor="progress">
						<span>Progress</span>
						<span className="ml-auto">{progress}%</span>
					</FieldLabel>
					<Progress value={progress} id="progress" />
				</Field>
				<div className='flex flex-row justify-between'>
					<p className='text-sm text-muted-foreground'>
						{
							timeStatus === SprintStatus.ACTIVE && <>Day {sinceStart} of {daysInSprint}</>
						}
					</p>
					<Badge variant='secondary'>
						{badgeIcon}
						{badgeText}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
