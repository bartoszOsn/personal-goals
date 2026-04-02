import { Button, Group, Stack, Text } from '@mantine/core';
import { IconFilePlus, IconFileX } from '@tabler/icons-react';
import { ReactNode } from 'react';
import { useCreateWorkItemMutation } from '@/api/work-item-old/work-item-hooks';
import { WorkItemType } from '@/models/WorkItemOld';

export function RoadmapEmptySplashScreen({ context }: { context: number }) {
	const workItemMutation = useCreateWorkItemMutation();

	const addObjective = () => {
		workItemMutation.mutate({
			context,
			type: WorkItemType.OBJECTIVE
		});
	}

	const addTask = () => {
		workItemMutation.mutate({
			context,
			type: WorkItemType.TASK
		})
	}

	return (
		<Stack align="center" bg="gray.1" justify="center" h="100%" w="100%" gap="lg">
			<IconFileX color="var(--mantine-color-blue-5)" size={100} />
			<Text size="xl">No work items</Text>
			<Group>
				<SplashButton onClick={addObjective} loading={workItemMutation.isPending}>
					<IconFilePlus color="var(--mantine-color-grape-5)" size={64} />
					<Text>Add Objective</Text>
				</SplashButton>
				<SplashButton onClick={addTask} loading={workItemMutation.isPending}>
					<IconFilePlus color="var(--mantine-color-gray-5)" size={64} />
					<Text>Add Task</Text>
				</SplashButton>
			</Group>
		</Stack>
	);
}

function SplashButton({ children, onClick, loading }: { children: ReactNode, loading?: boolean, onClick?: () => void }) {
	return <Button variant="default" w={180} h="unset" loading={loading} onClick={onClick}>
		<Stack align="center" p="lg">
			{children}
		</Stack>
	</Button>;
}