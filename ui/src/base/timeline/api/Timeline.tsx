import { timelineScales, timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { CSSProperties, Key, useRef, useState } from 'react';
import { Slot } from 'radix-ui';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName';
import { TimelineProps } from '@/base/timeline/api/TimelineProps';
import { deepHierarchyItemsToRowData, flatHierarchyItemsToRowData } from '@/base/timeline/internal/TimelineRowData';
import { TimelineRow } from '@/base/timeline/internal/components/TimelineRow';
import { TimelineRowCell } from '@/base/timeline/internal/components/TimelineRowCell';
import { TimelineRowChart } from '@/base/timeline/internal/components/TimelineRowChart';
import { TimelineHeaderRow } from '@/base/timeline/internal/components/TimelineHeaderRow';
import { TimelineHeaderChart } from '@/base/timeline/internal/components/timelineHeaderChart';
import { durationToPx } from '@/base/timeline/internal/durationToPx';
import { ButtonGroup } from '@/primitive/components/ui/button-group';
import { Button } from '@/primitive/components/ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { TimelineRowChartBar } from '@/base/timeline/internal/components/TimelineRowChartBar';
import { TimelineHeaderRowCell } from '@/base/timeline/internal/components/TimelineHeaderRowCell';
import { useRowSelection } from '@/base/timeline/internal/useRowSelection';
import { useClickOutside } from '@/base/useClickOutside';

export function Timeline<TId extends Key, TData>(props: TimelineProps<TId, TData>) {
	const [scale, setScale] = useState<keyof typeof timelineScaleToPxPerDay>('sm');
	const width = durationToPx(props.startDate.until(props.endDate), scale);
	const timelineTableWidth = 400;
	const timelineTableWidthPx = `${timelineTableWidth}px`;

	const isFlatHierarchy = 'flatHierarchyItems' in props;

	const [collapsedIds, setCollapsedIds] = useState<TId[]>([]);

	const rowDatas = isFlatHierarchy
		? flatHierarchyItemsToRowData(props.flatHierarchyItems)
		: deepHierarchyItemsToRowData(props.deepHierarchyItems, collapsedIds);

	const rootRef = useRef<HTMLDivElement | null>(null);

	const {
		selectedRows,
		clickedOn,
		clickOutside
	} = useRowSelection(rowDatas.map(row => row.id), (selectedRows) => {
		props.onSelectionChange?.(selectedRows);
	});

	useClickOutside(rootRef, () => clickOutside(), { withoutInteractiveElements: true})

	return (
		<Slot.Root ref={rootRef} className="relative overflow-x-auto border rounded" style={{ [timelineTableWidthCssPropertyName]: timelineTableWidthPx } as CSSProperties}>
			<div {...props.rootProps}>
				<div style={{ width: width + timelineTableWidth }}>
					<TimelineHeaderRow>
						<TimelineHeaderRowCell>
							<div className="w-full h-full p-2 flex items-center justify-end">
								<ButtonGroup>
									<Button size="icon-xs"
											variant="outline"
											disabled={scale === timelineScales.at(0)}
											onClick={() => setScale(scale => timelineScales.at(timelineScales.indexOf(scale) - 1)!)}>
										<MinusIcon />
									</Button>
									<Button size="icon-xs"
											variant="outline"
											disabled={scale === timelineScales.at(-1)}
											onClick={() => setScale(scale => timelineScales.at(timelineScales.indexOf(scale) + 1)!)}>
										<PlusIcon />
									</Button>
								</ButtonGroup>
							</div>
						</TimelineHeaderRowCell>
						<TimelineRowChart>
							<TimelineHeaderChart scale={scale} startDate={props.startDate} endDate={props.endDate} timeboxes={props.timeboxes} />
						</TimelineRowChart>
					</TimelineHeaderRow>
					{
						rowDatas.map((rowData) => (
							rowData.visible
								? (
									<TimelineRow key={rowData.id} isSelected={selectedRows.includes(rowData.id)} onClick={(withShift) => clickedOn(rowData.id, withShift)}>
										<TimelineRowCell row={rowData}
														 isSelected={selectedRows.includes(rowData.id)}
														 onChevronClick={() => setCollapsedIds(prev => prev.includes(rowData.id) ? prev.filter(id => id !== rowData.id) : [...prev, rowData.id])}>
											{
												props.renderCell(rowData.item.data)
											}
										</TimelineRowCell>
										<TimelineRowChart>
											{
												rowData.item.dates && (
													<TimelineRowChartBar posStart={rowData.item.dates.from} posEnd={rowData.item.dates.to} startDate={props.startDate}
																		 scale={scale}>
														{props.renderBar?.(rowData.item.data)}
													</TimelineRowChartBar>
												)
											}
										</TimelineRowChart>
									</TimelineRow>
								) : null
						))
					}
				</div>
			</div>
		</Slot.Root>
	);
}