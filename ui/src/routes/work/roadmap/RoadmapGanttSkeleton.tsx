import { Skeleton } from '@/primitive/components/ui/skeleton';

export function RoadmapGanttSkeleton() {
	return (
		<div className='flex flex-row flex-1 items-stretch gap-4'>
			<div className='flex flex-col flex-1 gap-2'>
				{
					Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className='w-full h-8' />)
				}
			</div>
			<Skeleton className='w-full flex-2' />
		</div>
	)
}