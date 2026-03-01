import { useOkrQuery } from '@/api/okr/okr-hooks.ts';
import { NoOkrsSplashScreen } from '@/routes/work/OKRs/NoOkrsSplashScreen';
import { useMemo } from 'react';
import { groupOkrs } from '@/routes/work/OKRs/groupOkrs';
import { ActionIcon, Group, Stack, Title } from '@mantine/core';
import { OkrGroupTable } from '@/routes/work/OKRs/OkrGroupTable';
import { CreateObjectiveModal } from '@/routes/work/OKRs/CreateObjectiveModal';

export function OKRs() {
	const objectives = useOkrQuery();
	const years = useMemo(() => groupOkrs(objectives.data ?? []), [objectives.data]);

	if (years.length === 0) {
		return <NoOkrsSplashScreen />
	}
	return (
		<Stack gap="xl">
			{
				years.map(year => (
					<Stack key={year.year} pt='xl'>
						<Group gap='xs'>
							<Title c='blue'>{year.year}</Title>
							<CreateObjectiveModal initialDeadline={{ year: year.year, quarter: null }}>
								{
									open => <ActionIcon size='sm' variant="subtle" onClick={open}>+</ActionIcon>
								}
							</CreateObjectiveModal>
						</Group>
						{ year.global.length > 0 && <OkrGroupTable objectives={year.global} deadline={year.global[0].deadline} /> }
						{ year.Q1.length > 0 && <OkrGroupTable objectives={year.Q1} deadline={year.Q1[0].deadline} /> }
						{ year.Q2.length > 0 && <OkrGroupTable objectives={year.Q2} deadline={year.Q2[0].deadline} /> }
						{ year.Q3.length > 0 && <OkrGroupTable objectives={year.Q3} deadline={year.Q3[0].deadline} /> }
						{ year.Q4.length > 0 && <OkrGroupTable objectives={year.Q4} deadline={year.Q4[0].deadline} /> }
					</Stack>
				))
			}
		</Stack>
	)
	return

}