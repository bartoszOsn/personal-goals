import { Badge, Group, Paper, Progress, Skeleton, Text, ThemeIcon } from '@mantine/core';
import { IconArrowForwardUp } from '@tabler/icons-react';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { getSprintName } from '@/core/getSprintName';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { SprintId } from '@/models/Sprint';

export function SprintOverviewSprintInfo({ sprintId }: { sprintId: SprintId }) {
	const sprintQuery = useSprintQuery();
	const currentSprint = sprintQuery.data?.find(s => s.id === sprintId);

	if (sprintQuery.isPending || !currentSprint) {
		return <Skeleton w='100%' h={70} />
	}

	const start = currentSprint.startDate;
	const end = currentSprint.endDate;

	const timeStatus = getTimeStatus(start, end);
	const color = colorMap[timeStatus];
	const sinceStart = Temporal.Now.plainDateISO().since(start).total('days') + 1;
	const untilEnd = Temporal.Now.plainDateISO().until(end).total('days');
	const daysInSprint = start.until(end).total('days') + 1;
	const progress = Math.round(Math.max(Math.min((sinceStart - 1) / daysInSprint * 100, 100), 0));

	const badgeText = timeStatus === 'past'
		? 'Completed'
		: timeStatus === 'future'
			? 'Future'
			: `${untilEnd} days left`

	return (
		<Paper radius="md" withBorder pos='relative' style={{ overflow: 'visible' }} p='xl' pt='calc(var(--mantine-spacing-xl) * 1.5 + 20px)' mt={20}>
			<ThemeIcon color={color} pos='absolute' style={{ top: -20, left: 'calc(50% - 30px)' }} size={60} radius={60}>
				<IconArrowForwardUp size={32} stroke={1.5} />
			</ThemeIcon>

			<Text ta="center" fw={700}>
				{ getSprintName(currentSprint) }
			</Text>
			<Text c="dimmed" ta="center" fz="sm">
				{start.toLocaleString()} → {end.toLocaleString()}
			</Text>

			<Group justify="space-between" mt="xs">
				<Text fz="sm" c="dimmed">
					Progress
				</Text>
				<Text fz="sm" c="dimmed">
					{progress}%
				</Text>
			</Group>

			<Progress value={progress} color={color} mt={5} aria-label="Progress" />

			<Group justify="space-between" mt="md">
				<Text fz="sm">
					{
						timeStatus === 'current' && <>Day {sinceStart} of {daysInSprint}</>
					}
				</Text>
				<Badge color={color} size="sm">{badgeText}</Badge>
			</Group>
		</Paper>
	);
}

function getTimeStatus(start: Temporal.PlainDate, end: Temporal.PlainDate) {
	const now = Temporal.Now.plainDateISO();
	if (isPlainDate(now).afterOrEqual(start) && isPlainDate(now).beforeOrEqual(end)) {
		return 'current';
	}

	if (isPlainDate(now).afterOrEqual(end)) {
		return 'past';
	}

	return 'future';
}

const colorMap = {
	'current': 'blue',
	'past': 'green',
	'future': 'gray'
} as const;