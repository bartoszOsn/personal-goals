import { Button } from '@/primitive/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/primitive/components/ui/empty';
import { CircleOffIcon } from 'lucide-react';
import { useCreateSprintsMutation, useFillSprintsMutation } from '@/api/sprint/sprint-hooks';
import { Spinner } from '@/primitive/components/ui/spinner';

export function SprintSettingsEmptySplashScreen({context}: {context: number}) {
	const fillSprintsMutation = useFillSprintsMutation(context);
	const createSprintsMutation = useCreateSprintsMutation(context);

	const isPending = fillSprintsMutation.isPending || fillSprintsMutation.isPending;

	return <Empty>
		<EmptyHeader>
			<EmptyMedia variant='icon'>
				<CircleOffIcon />
			</EmptyMedia>
			<EmptyTitle>No sprints</EmptyTitle>
			<EmptyDescription>There are no sprints in {context}</EmptyDescription>
		</EmptyHeader>
		<EmptyContent>
			<Button disabled={isPending} onClick={() => fillSprintsMutation.mutate()}>
				{
					isPending && <Spinner />
				}
				Fill year with sprints
			</Button>
			<Button disabled={isPending} onClick={() => createSprintsMutation.mutate()} variant='outline'>
				{
					isPending && <Spinner />
				}
				Create one
			</Button>
		</EmptyContent>
	</Empty>
}