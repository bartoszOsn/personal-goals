import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent.tsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/primitive/components/ui/empty.tsx';
import { CircleOffIcon } from 'lucide-react';
import { Button } from '@/primitive/components/ui/button.tsx';
import { Link } from '@tanstack/react-router';

export function SprintOverviewEmpty({ context }: { context: number }) {
	return (
		<PageContent>
			<PageContentHeader>
				No sprints in {context}.
			</PageContentHeader>
			<PageContentContent>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant='icon'>
							<CircleOffIcon />
						</EmptyMedia>
						<EmptyTitle>No sprints</EmptyTitle>
						<EmptyDescription>No sprints available for the selected context.</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button asChild>
							<Link to='/work/$context/sprint-settings' params={{ context: context.toString() }}>
								Go to sprint settings
							</Link>
						</Button>
					</EmptyContent>
				</Empty>
			</PageContentContent>
		</PageContent>
	)
}