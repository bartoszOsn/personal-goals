import { useSprintQuery, useUpdateSprintsMutation } from '@/api/sprint/sprint-hooks';
import { useState } from 'react';
import { Sprint, SprintId } from '@/models/Sprint';
import { getRouteApi } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { Skeleton } from '@/primitive/components/ui/skeleton';
import { SprintMenubar } from '@/routes/work/sprint-settings/SprintMenubar';
import { Timeline } from '@/base/timeline/api/Timeline';
import { FlatHierarchyTimelineItem } from '@/base/timeline/api/TimelineProps';
import { Popover, PopoverContent, PopoverTrigger } from '@/primitive/components/ui/popover';
import { Button } from '@/primitive/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/primitive/components/ui/calendar';
import { formatTimeRange } from '@/base/formatTimeRange';

export function SprintSettingsRoute() {
	const context = getRouteApi('/work/$context/sprint-settings')
		.useParams({
			select: (params) => isNaN(+params.context) ? Temporal.Now.plainDateISO().year : +params.context
		});

	const sprints = useSprintQuery(context);
	const updateSprints = useUpdateSprintsMutation(context);

	const ganttItems: FlatHierarchyTimelineItem<SprintId, Sprint>[] = !sprints.data ? [] : sprints.data.map(sprint => ({
		id: sprint.id,
		dates: { from: sprint.startDate, to: sprint.endDate },
		data: sprint
	}));

	const [selectedItemIds, setSelectedItemIds] = useState<SprintId[]>([]);

	const contextStartDate = Temporal.PlainDate.from({ year: context, month: 1, day: 1 });
	const contextEndDate = Temporal.PlainDate.from({ year: context, month: 12, day: 31 });

	return (
		<PageContent>
			<PageContentHeader>
				<SprintMenubar context={context} selectedSprintIds={selectedItemIds} />
			</PageContentHeader>
			<PageContentContent>
				{
					sprints.isLoading && (
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
				{
					ganttItems.length > 0 && <Timeline startDate={contextStartDate}
													   endDate={contextEndDate}
													   renderCell={(sprint) => (
														   <div className='w-full h-full flex flex-row justify-between items-center py-1 px-2'>
															   <span>{sprint.name}</span>
															   <Popover>
																   <PopoverTrigger asChild>
																	   <Button
																		   variant="secondary"
																		   size="sm"
																		   id="date-picker-range"
																		   className="justify-start w-fit  font-normal"
																	   >
																		   <CalendarIcon />
																		   {formatTimeRange(sprint.startDate, sprint.endDate)}
																	   </Button>
																   </PopoverTrigger>
																   <PopoverContent className="w-auto p-0" align="start">
																	   <Calendar
																		   mode="range"
																		   defaultMonth={temporalToLegacy(sprint.startDate)}
																		   selected={{ from: temporalToLegacy(sprint.startDate), to: temporalToLegacy(sprint.endDate) }}
																		   onSelect={range => {
																			   if (!range || !range.from || !range.to) {
																				   return;
																			   }

																			   updateSprints.mutateAsync({
																				   [sprint.id]: {
																					   newStartDate: legacyToTemporal(range.from),
																					   newEndDate: legacyToTemporal(range.to)
																				   }
																			   });
																		   }}
																		   numberOfMonths={2}
																	   />
																   </PopoverContent>
															   </Popover>
														   </div>
													   )}
													   flatHierarchyItems={ganttItems}
													   onSelectionChange={setSelectedItemIds}
													   onDatesChange={async (sprintId, dates) => {
														   await updateSprints.mutateAsync({
															   [sprintId]: {
																   newStartDate: dates.from,
																   newEndDate: dates.to
															   }
														   });
													   }}
					/>
				}
			</PageContentContent>
		</PageContent>
	);
}

function temporalToLegacy(date: Temporal.PlainDate): Date {
	return new Date(date.year, date.month - 1, date.day);
}

function legacyToTemporal(date: Date): Temporal.PlainDate {
	return Temporal.PlainDate.from({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
}