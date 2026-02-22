import { Group, Skeleton, Stack } from '@mantine/core';
import { useSprintQuery } from '@/api/sprint-hooks';
import { useEffect } from 'react';
import { Temporal } from 'temporal-polyfill';
import { isPlainDate } from '@personal-okr/shared';
import { useNavigate } from '@tanstack/react-router';

export function SprintOverviewCurrentSprintLoader() {
	const sprints = useSprintQuery();
	const navigate = useNavigate();

	useEffect(() => {
		if (sprints.isPending) {
			return;
		}

		if (!sprints.data) {
			return;
		}

		const currentSprint = sprints.data.sprints
			.find(sprint => {
				const start = Temporal.PlainDate.from(sprint.startDate);
				const end = Temporal.PlainDate.from(sprint.endDate);
				const now = Temporal.Now.plainDateISO();

				return isPlainDate(now).afterOrEqual(start) && isPlainDate(now).beforeOrEqual(end);
			});

		const navigateTo = currentSprint ?? sprints.data.sprints[0];

		if (navigateTo) {
			navigate({ to: '/work/sprint-overview/{-$sprintId}', params: { sprintId: navigateTo.id }})
				.then();
		}
	}, [sprints.isPending, sprints.data, navigate]);

	return (
		<Stack w="100%" h="100vh" p="lg">
			<Skeleton w="100%" h={30} />
			<Skeleton w="100%" h={70} />
			<Group flex={1}>
				<Skeleton w="100%" h='100%' flex={1} />
				<Skeleton w="100%" h='100%' flex={1} />
				<Skeleton w="100%" h='100%' flex={1} />
			</Group>
		</Stack>
	);
}