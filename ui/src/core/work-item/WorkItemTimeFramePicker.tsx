import { WorkItem, WorkItemTimeFrame, WorkItemTimeFrameType } from '@/models/WorkItem.ts';
import { Button } from '@/primitive/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/primitive/components/ui/sheet.tsx';
import { ReactNode, useState } from 'react';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { Spinner } from '@/primitive/components/ui/spinner';
import { RadioGroup, RadioGroupItem } from '@/primitive/components/ui/radio-group';
import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/primitive/components/ui/field';
import { Input } from '@/primitive/components/ui/input';
import { Link } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';
import { numberToQuarter, quarterToNumber } from '@/models/Quarter';
import { Sprint } from '@/models/Sprint';
import { CalendarIcon } from 'lucide-react';
import { useUpdateWorkItemsInHierarchyMutation } from '@/api/work-item/work-item-hooks';
import { formatTimeRange } from '@/base/formatTimeRange';
import { RangePicker, RangePickerTrigger } from '@/primitive/components/customized/RangePicker';

export function WorkItemTimeFramePicker({ workItem, children }: { workItem: WorkItem, children: ReactNode }) {
	const [opened, setOpened] = useState(false);

	return <Sheet open={opened} onOpenChange={setOpened}>
		<SheetTrigger asChild>
			{children}
		</SheetTrigger>
		<SheetContent onContextMenu={e => e.stopPropagation()}>
			<WorkItemTimeFramePickerSheetContent workItem={workItem} close={() => setOpened(false)} />
		</SheetContent>
	</Sheet>;
}

function WorkItemTimeFramePickerSheetContent({ workItem, close }: { workItem: WorkItem, close: () => void }) {
	const sprints = useSprintQuery(workItem.contextYear);
	const updateWorkItemMutation = useUpdateWorkItemsInHierarchyMutation();
	const [customStartDate, setCustomStartDate] = useState<Temporal.PlainDate>(() => workItem.timeFrame?.startDate ?? Temporal.Now.plainDateISO());
	const [customEndDate, setCustomEndDate] = useState<Temporal.PlainDate>(() => workItem.timeFrame?.endDate ?? Temporal.Now.plainDateISO());
	const [searchText, setSearchText] = useState<string>('');

	const allSections = getAllItems(workItem.contextYear, customStartDate, customEndDate, sprints.data ?? []);
	const filteredSections = getFilteredSections(allSections, searchText);

	const [selectedId, setSelectedId] = useState<string>(() => getSelectedIdFromWorkItem(workItem));
	const selected = findItemById(selectedId, allSections);
	
	if (!sprints.data || sprints.isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<SheetHeader>
				<SheetTitle>Pick time frame</SheetTitle>
				<SheetDescription>Change time frame for <Link className='underline underline-offset-4 hover:text-primary' to={'/work/$context/details/$workItemId'} params={{ context: workItem.contextYear.toString(), workItemId: workItem.id}} target='_blank'>"{workItem.title}"</Link></SheetDescription>
			</SheetHeader>
			<div className="px-4">
				<Input placeholder="Search" value={searchText} onChange={e => setSearchText(e.target.value)} />
			</div>
			<div className="px-4 overflow-y-auto">
				{
					filteredSections.length === 0
						? <p className='text-muted-foreground text-center'>No timeframes matching "{searchText}"</p>
						: filteredSections.map(section => (
							<FieldSet key={section.id} className="mb-4">
								<FieldLegend>{section.name}</FieldLegend>
								<FieldDescription>{section.description}</FieldDescription>
								<RadioGroup>
									{
										section.items.map(item => (
											<FieldLabel htmlFor={item.id} onClick={() => setSelectedId(item.id)}>
												<Field orientation="horizontal">
													<FieldContent>
														<FieldTitle>{item.name}</FieldTitle>
														<FieldDescription>
															{
																item.timeFrame && (formatTimeRange(item.timeFrame.startDate, item.timeFrame.endDate))
															}
														</FieldDescription>
													</FieldContent>
													<RadioGroupItem checked={selectedId === item.id} value={item.id} id={item.id} />
												</Field>
											</FieldLabel>
										))
									}
								</RadioGroup>
								{
									section.showCustomDatePicker && (
										<RangePicker value={{ start: customStartDate, end: customEndDate}} onValueChange={range => {
											setCustomStartDate(range.start);
											setCustomEndDate(range.end);
										}}>
											<RangePickerTrigger asChild>
												<Button
													variant="secondary"
													size="lg"
													id="date-picker-range"
													className="justify-start w-fit self-end px-2.5 font-normal"
												>
													<CalendarIcon />
													{formatTimeRange(customStartDate, customEndDate)}
												</Button>
											</RangePickerTrigger>
										</RangePicker>
									)
								}
							</FieldSet>
						))
				}
			</div>
			<SheetFooter>
				<Button type="submit" disabled={!selected} onClick={() => {
					if (!selected) {
						return;
					}

					updateWorkItemMutation.mutateAsync({
						context: workItem.contextYear,
						request: {
							updates: {
								[workItem.id]: {
									timeFrame: selected.timeFrame
								}
							}
						}
					}).then(() => close());
				}}>
					{updateWorkItemMutation.isPending && <Spinner />}
					Save
				</Button>
				<SheetClose asChild>
					<Button variant="outline">Cancel</Button>
				</SheetClose>
			</SheetFooter>
		</>
	);
}

interface TimeFrameSection {
	id: string;
	name: string;
	description: ReactNode;
	items: TimeFrameItem[];
	showCustomDatePicker?: boolean;
}

interface TimeFrameItem {
	id: string;
	name: string;
	timeFrame: WorkItemTimeFrame | null;
}

function getAllItems(context: number, customStartDate: Temporal.PlainDate, customEndDate: Temporal.PlainDate, sprints: Sprint[]): TimeFrameSection[] {
	const sections: TimeFrameSection[] = [];

	sections.push({
		id: 'no-time-frame-section',
		name: 'No time frame',
		description: 'For work items without planned period.',
		items: [{
			id: 'no-time-frame-item',
			name: 'No time frame',
			timeFrame: null
		}]
	});

	sections.push({
		id: 'custom-section',
		name: 'Custom',
		description: 'Assign the task to chosen period',
		items: [{
			id: 'custom-item',
			name: 'Custom dates',
			timeFrame: {
				type: WorkItemTimeFrameType.CUSTOM_DATE,
				startDate: customStartDate,
				endDate: customEndDate,
				context: context
			}
		}],
		showCustomDatePicker: true
	});

	sections.push({
		id: 'whole-year-section',
		name: 'Whole year',
		description: 'Time frame spanning whole year.',
		items: [{
			id: 'whole-year-item',
			name: context.toString(),
			timeFrame: {
				type: WorkItemTimeFrameType.WHOLE_YEAR,
				startDate: Temporal.PlainDate.from({ year: context, month: 1, day: 1 }),
				endDate: Temporal.PlainDate.from({ year: context, month: 12, day: 31 }),
				context: context
			}
		}]
	});

	const quarterSection: TimeFrameSection = {
		id: 'quarter-section',
		name: 'Quarterly',
		description: 'Time frame spanning quarters of the year.',
		items: []
	};
	for (const quarter in numberToQuarter) {
		quarterSection.items.push({
			id: `quarter-Q${quarter}-item`,
			name: `Quarter Q${quarter}`,
			timeFrame: {
				type: WorkItemTimeFrameType.QUARTER,
				quarter: numberToQuarter[quarter as unknown as keyof typeof numberToQuarter],
				startDate: Temporal.PlainDate.from({ year: context, month: (parseInt(quarter) - 1) * 3 + 1, day: 1 }),
				endDate: Temporal.PlainDate.from({ year: context, month: (parseInt(quarter) - 1) * 3 + 3, day: 31 }),
				context: context
			}
		});
	}
	sections.push(quarterSection);

	const sprintsSection: TimeFrameSection = {
		id: 'sprints-section',
		name: 'Sprint',
		description: <>One of the sprints defined in <Link to={'/work/$context/sprint-settings'} params={{ context: context.toString() }} target="_blank">Sprint
			Settings</Link></>,
		items: sprints.map(sprint => ({
			id: `sprint-${sprint.id}-item`,
			name: sprint.name,
			timeFrame: {
				type: WorkItemTimeFrameType.SPRINT,
				sprintId: sprint.id,
				startDate: sprint.startDate,
				endDate: sprint.endDate,
				context: context
			}
		}))
	};
	sections.push(sprintsSection);

	return sections;
}

function getFilteredSections(sections: TimeFrameSection[], search: string): TimeFrameSection[] {
	return sections.reduce((acc, section) => {
		if (section.name.toLowerCase().includes(search.toLowerCase())) {
			return [...acc, section];
		}

		const sectionFilteredItems = section.items.filter(item => {
			return item.name.toLowerCase().includes(search.toLowerCase());
		});

		if (sectionFilteredItems.length === 0) {
			return acc;
		}

		return [...acc, { ...section, items: sectionFilteredItems }];
	}, [] as TimeFrameSection[]);
}

function getSelectedIdFromWorkItem(workItem: WorkItem): string {
	if (!workItem.timeFrame) {
		return 'no-time-frame-item';
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.CUSTOM_DATE) {
		return 'custom-item';
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.WHOLE_YEAR) {
		return 'whole-year-item';
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.QUARTER) {
		return `quarter-Q${quarterToNumber[workItem.timeFrame.quarter]}-item`;
	}

	if (workItem.timeFrame.type === WorkItemTimeFrameType.SPRINT) {
		return `sprint-${workItem.timeFrame.sprintId}-item`;
	}

	return 'no-time-frame-item';
}

function findItemById(id: string, sections: TimeFrameSection[]): TimeFrameItem | null {
	for (const section of sections) {
		for (const item of section.items) {
			if (item.id === id) {
				return item;
			}
		}
	}
	return null;
}
