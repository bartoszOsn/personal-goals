import { GanttProps } from '@/base/gantt/GanttProps.ts';
import { createContext, ReactNode, RefObject, useContext, useRef, useState } from 'react';
import { RowPositionInfo } from '@/base/gantt/model/RowPositionInfo';
import { zoomLevels } from '@/base/gantt/zoomLevels';
import { ZoomLevel } from '@/base/gantt/model/ZoomLevel';
import { DragData } from '@/base/gantt/model/DragData';
import { GanttItem } from '@/base/gantt/GanttItem';

export interface GanttContext<TData> {
	props: GanttProps<TData>;
	flattenedItems: GanttItem<TData>[];
	rows: RowPositionInfo[];
	setRows(rows: RowPositionInfo[]): void;
	scrollAreaHeight: number;
	setScrollAreaHeight(scrollAreaHeight: number): void;
	subscribeToScrollY: (callback: (scrollY: number) => void) => () => void;
	setScrollY(scrollY: number): void;
	zoomLevel: ZoomLevel;
	setZoomLevel(zoomLevel: ZoomLevel): void;
	chartViewportWidth: number;
	setChartViewportWidth(viewportWidth: number): void;
	dragData: DragData;
	setDragData(data: DragData): void;
	svg: RefObject<SVGSVGElement | null>;
	chartHeaderSize: number;
	setChartHeaderSize(headerSize: number): void;
	selectedItemIdsRef: RefObject<string[]>;
}

const GanttContext = createContext<GanttContext<unknown> | null>(null);

export interface GanttProviderProps<TData> {
	props: GanttProps<TData>;
	children: ReactNode;
}

export function GanttProvider<TData>(props: GanttProviderProps<TData>) {
	const [rows, setRows] = useState<RowPositionInfo[]>([]);
	const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
	const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(zoomLevels[0]);
	const [chartViewportWidth, setChartViewportWidth] = useState(0);
	const [dragData, setDragData] = useState<DragData>({ status: 'idle' });
	const svg = useRef<SVGSVGElement>(null);
	const [chartHeaderSize, setChartHeaderSize] = useState(0);
	const flattenedItems: GanttItem<TData>[] = getFlattenedItems(props.props.items);

	const scrollYSubscribers = useRef<Set<(y: number) => void>>(new Set());
	const subscribeToScrollY = (callback: (scrollY: number) => void) => {
		scrollYSubscribers.current?.add(callback);
		return () => {
			scrollYSubscribers.current?.delete(callback);
		}
	}
	const setScrollY = (y: number) => {
		scrollYSubscribers.current?.forEach(callback => callback(y));
	}

	const selectedItemIdsRef = useRef<string[]>([]);

	const context: GanttContext<unknown> = {
		props: props.props as GanttProps<unknown>,
		rows, setRows,
		scrollAreaHeight, setScrollAreaHeight,
		setScrollY, subscribeToScrollY,
		zoomLevel, setZoomLevel,
		chartViewportWidth, setChartViewportWidth,
		dragData, setDragData,
		svg,
		chartHeaderSize, setChartHeaderSize,
		selectedItemIdsRef,
		flattenedItems
	};

	return (
		<GanttContext.Provider value={context}>
			{props.children}
		</GanttContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGanttContext<TData>(): GanttContext<TData> {
	const context = useContext(GanttContext) as GanttContext<TData> | null;

	if (!context) {
		throw new Error('No GanttProvider in component tree')
	}

	return context;
}

function getFlattenedItems<TData>(items: GanttItem<TData>[]) {
	const result: GanttItem<TData>[] = [];
	const stack = [...items];

	while(stack.length > 0) {
		const item = stack.shift()!;
		result.push(item);
		stack.unshift(...item.children)
	}

	return result;
}