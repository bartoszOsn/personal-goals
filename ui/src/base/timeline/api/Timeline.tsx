import { timelineScales, timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { Key, useEffect, useRef, useState } from 'react';
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
import { DragAutoScroll } from '@/base/dnd/api/DragAutoScroll';
import { useMonitorDrop } from '@/base/dnd/api/useMonitorDrop';
import { getTimelineDnDContext } from '@/base/timeline/internal/timelineDnDContext';
import { useIsMobile } from '@/primitive/hooks/use-mobile';
import { TimelinePanelResizable } from '@/base/timeline/internal/components/TimelinePanelResizable';

export function Timeline<TId extends Key, TData>(props: TimelineProps<TId, TData>) {
	const isMobile = useIsMobile();
	const [scale, setScale] = useState<keyof typeof timelineScaleToPxPerDay>('sm');
	const timelineTableWidthRef = useRef(400);

	const isFlatHierarchy = 'flatHierarchyItems' in props;

	const [collapsedIds, setCollapsedIds] = useState<TId[]>([]);

	const rowDatas = isFlatHierarchy
		? flatHierarchyItemsToRowData(props.flatHierarchyItems)
		: deepHierarchyItemsToRowData(props.deepHierarchyItems, collapsedIds);

	const rootRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLDivElement | null>(null);

	const {
		selectedRows,
		clickedOn,
		clickOutside
	} = useRowSelection(rowDatas.map(row => row.id), (selectedRows) => {
		props.onSelectionChange?.(selectedRows);
	});

	useClickOutside(rootRef, () => clickOutside(), { withoutInteractiveElements: true});

	const [movePending, setMovePending] = useState(false);

	useMonitorDrop(getTimelineDnDContext<TId, TData>(), (drag, drop) => {
		if (!drag || !drop) return;

		if (!props.onMove) {
			return;
		}

		if ('flatHierarchyItems' in props) {
			setMovePending(true);
			Promise.resolve(
				props.onMove({
					itemId: drag.id,
					precedingItemId: drop.dropBelow?.id ?? null,
					succeedingItemId: drop.dropAbove?.id ?? null
				})
			).finally(() => setMovePending(false));
		} else {
			setMovePending(true);
			Promise.resolve(
				props.onMove({
					itemId: drag.id,
					precedingItemId: drop.dropBelow?.id ?? null,
					succeedingItemId: drop.dropAbove?.id ?? null,
					newParentId: drop.dropInto?.id ?? null
				})
			).finally(() => setMovePending(false));
		}
	});

	const setWidth = (timelineWidth: number) => {
		if (rootRef.current && canvasRef.current) {
			timelineTableWidthRef.current = Math.max(150, Math.min(timelineWidth, rootRef.current.offsetWidth - 4));

			const timelineTableWidthPx = isMobile ? `100%` : `${timelineTableWidthRef.current}px`;
			rootRef.current.style.setProperty(timelineTableWidthCssPropertyName, timelineTableWidthPx);

			const width = isMobile ? 0 : durationToPx(props.startDate.until(props.endDate), scale);

			const wholeWidth = isMobile ? '100%' : timelineTableWidthRef.current + width + 'px';
			canvasRef.current.style.width = wholeWidth;
		}
	}

	useEffect(() => {
		if (rootRef.current && canvasRef.current) {
			const timelineTableWidthPx = isMobile ? `100%` : `${timelineTableWidthRef.current}px`;
			rootRef.current.style.setProperty(timelineTableWidthCssPropertyName, timelineTableWidthPx);

			const width = isMobile ? 0 : durationToPx(props.startDate.until(props.endDate), scale);

			const wholeWidth = isMobile ? '100%' : timelineTableWidthRef.current + width + 'px';
			canvasRef.current.style.width = wholeWidth;
		}
	}, [isMobile, props.endDate, props.startDate, scale]);

	return (
		<DragAutoScroll allowedAxis='vertical'>
			<Slot.Root ref={rootRef} className="relative overflow-x-auto border rounded overflow-y-hidden">
				<div {...props.rootProps}>
					<div ref={canvasRef} className='relative'>
						<TimelinePanelResizable getOffset={() => timelineTableWidthRef.current} setOffset={setWidth} />
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
										<TimelineRow key={rowData.id}
													 row={rowData}
													 isSelected={selectedRows.includes(rowData.id)}
													 movePending={movePending}
													 onClick={(withShift) => clickedOn(rowData.id, withShift)}
													 canBeParent={isFlatHierarchy ? () => true : (props.canBeParent ?? (() => true)) }
										>
											<TimelineRowCell row={rowData}
															 isSelected={selectedRows.includes(rowData.id)}
															 showDragHandle={!!props.onMove}
															 movePending={movePending}
															 onChevronClick={() => setCollapsedIds(prev => prev.includes(rowData.id) ? prev.filter(id => id !== rowData.id) : [...prev, rowData.id])}>
												{
													props.renderCell(rowData.item.data)
												}
											</TimelineRowCell>
											<TimelineRowChart>
												{
													rowData.item.dates && (
														<TimelineRowChartBar posStart={rowData.item.dates.from} posEnd={rowData.item.dates.to}
																			 startDate={props.startDate}
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
		</DragAutoScroll>
	);
}