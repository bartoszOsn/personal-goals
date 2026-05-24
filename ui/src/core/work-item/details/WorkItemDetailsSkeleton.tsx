import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { Skeleton } from '@/primitive/components/ui/skeleton';

export function WorkItemDetailsSkeleton() {
	return (
		<PageContent>
			<PageContentHeader>
				<Skeleton className="w-full h-6" />
			</PageContentHeader>
			<PageContentContent>
				<div className="flex flex-row gap-2 mb-4">
					<Skeleton className="flex-1 h-12" />
					<Skeleton className="flex-1 h-12" />
					<Skeleton className="flex-1 h-12" />
				</div>
				<Skeleton className="w-full h-24" />
			</PageContentContent>
		</PageContent>
	)
}