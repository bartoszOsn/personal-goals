import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent.tsx';
import { Skeleton } from '@/primitive/components/ui/skeleton.tsx';

export function SprintOverviewSkeleton() {
	return <PageContent>
		<PageContentHeader>
			<Skeleton className="w-full h-10" />
		</PageContentHeader>
		<PageContentContent>
			<Skeleton className='w-full h-30 mb-4' />
			<div className='w-full h-70 flex flex-row gap-4'>
				<Skeleton className='h-70 flex-1' />
				<Skeleton className='h-70 flex-1' />
				<Skeleton className='h-70 flex-1' />
			</div>
		</PageContentContent>
	</PageContent>
}