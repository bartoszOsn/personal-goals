import { timelineScales, timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { CSSProperties, Key, useState } from 'react';
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

export function Timeline<TId extends Key, TData>(props: TimelineProps<TId, TData>) {
	const [scale, setScale] = useState<keyof typeof timelineScaleToPxPerDay>('sm');
	const width = durationToPx(props.startDate.until(props.endDate), scale);
	const timelineTableWidth = 300;
	const timelineTableWidthPx = `${timelineTableWidth}px`;

	const isFlatHierarchy = 'flatHierarchyItems' in props;

	const rowDatas = isFlatHierarchy
		? flatHierarchyItemsToRowData(props.flatHierarchyItems)
		: deepHierarchyItemsToRowData(props.deepHierarchyItems);

	return (
		<Slot.Root className="relative overflow-x-auto border rounded" style={{ [timelineTableWidthCssPropertyName]: timelineTableWidthPx } as CSSProperties}>
			<div {...props.rootProps}>
				<div style={{ width: width + timelineTableWidth }}>
					<TimelineHeaderRow>
						<TimelineRowCell>
							<div className='w-full h-full p-2 flex items-center justify-end'>
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
						</TimelineRowCell>
						<TimelineRowChart>
							<TimelineHeaderChart scale={scale} startDate={props.startDate} endDate={props.endDate} timeboxes={props.timeboxes} />
						</TimelineRowChart>
					</TimelineHeaderRow>
					{
						rowDatas.map((rowData) => (
							<TimelineRow key={rowData.id}>
								<TimelineRowCell>
									{
										props.renderCell(rowData.item.data)
									}
								</TimelineRowCell>
								<TimelineRowChart>
									{/* TODO */}
									<div className='w-16 h-6 bg-background border rounded my-1 absolute left-12'></div>
								</TimelineRowChart>
							</TimelineRow>
						))
					}
				</div>
			</div>
		</Slot.Root>
	);
}