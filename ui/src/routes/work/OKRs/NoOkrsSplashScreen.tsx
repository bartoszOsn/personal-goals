import { Button, Stack, Text, Title } from '@mantine/core';
import { CreateObjectiveModal } from '@/routes/work/OKRs/CreateObjectiveModal';

export function NoOkrsSplashScreen() {
	return (
		<Stack align={'center'}>
			<Title>No objectives</Title>
			<Text>Create your first objective</Text>
			<CreateObjectiveModal>
				{
					(onClick) => (
						<Button onClick={onClick}>Create</Button>
					)
				}
			</CreateObjectiveModal>
		</Stack>
	);
}