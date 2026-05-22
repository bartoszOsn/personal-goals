import { timelineScaleToPxPerDay } from '@/base/timeline/internal/timelineScaleToPx.ts';
import { CSSProperties, Key, useState } from 'react';
import { Slot } from 'radix-ui';
import { timelineTableWidthCssPropertyName } from '@/base/timeline/internal/timelineTableWidthCssPropertyName';
import { TimelineProps } from '@/base/timeline/api/TimelineProps';
import { deepHierarchyItemsToRowData, flatHierarchyItemsToRowData } from '@/base/timeline/internal/TimelineRowData';
import { TimelineRow } from '@/base/timeline/internal/components/TimelineRow';
import { TimelineRowCell } from '@/base/timeline/internal/components/TimelineRowCell';
import { TimelineRowChart } from '@/base/timeline/internal/components/TimelineRowChart';

export function Timeline<TId extends Key, TData>(props: TimelineProps<TId, TData>) {
	const [scale, setScale] = useState<keyof typeof timelineScaleToPxPerDay>('sm');
	const width = props.startDate.until(props.endDate).total('days') * timelineScaleToPxPerDay[scale];
	const timelineTableWidth = 300;
	const timelineTableWidthPx = `${timelineTableWidth}px`;

	const isFlatHierarchy = 'flatHierarchyItems' in props;

	const rowDatas = isFlatHierarchy
		? flatHierarchyItemsToRowData(props.flatHierarchyItems)
		: deepHierarchyItemsToRowData(props.deepHierarchyItems);

	return (
		<Slot.Root className="relative overflow-x-auto border rounded" style={{ [timelineTableWidthCssPropertyName]: timelineTableWidthPx } as CSSProperties}>
			<div {...props.rootProps}>
				<div style={{ width }}>
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