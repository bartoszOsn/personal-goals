import type { GanttProps } from '@/base/gantt/GanttProps.ts';
import { createContext, type ReactNode, type RefObject, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { RowPositionInfo } from '@/base/gantt/model/RowPositionInfo';
import { zoomLevels } from '@/base/gantt/zoomLevels';
import type { ZoomLevel } from '@/base/gantt/model/ZoomLevel';
import type { DragData } from '@/base/gantt/model/DragData';

export interface GanttContext<TData> {
	props: GanttProps<TData>;
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

	const scrollYSubscribers = useRef<Set<(y: number) => void>>(new Set());
	const subscribeToScrollY = useCallback((callback: (scrollY: number) => void) => {
		scrollYSubscribers.current?.add(callback);
		return () => {
			scrollYSubscribers.current?.delete(callback);
		}
	}, []);
	const setScrollY = useCallback((y: number) => {
		scrollYSubscribers.current?.forEach(callback => callback(y));
	}, []);

	const selectedItemIdsRef = useRef<string[]>([]);

	const context: GanttContext<unknown> = useMemo(() => ({
		props: props.props as GanttProps<unknown>,
		rows, setRows,
		scrollAreaHeight, setScrollAreaHeight,
		setScrollY, subscribeToScrollY,
		zoomLevel, setZoomLevel,
		chartViewportWidth, setChartViewportWidth,
		dragData, setDragData,
		svg,
		chartHeaderSize, setChartHeaderSize,
		selectedItemIdsRef
	}), [props.props, rows, scrollAreaHeight, setScrollY, subscribeToScrollY, zoomLevel, chartViewportWidth, dragData, chartHeaderSize])

	return (
		<GanttContext.Provider value={context}>
			{props.children}
		</GanttContext.Provider>
	);
}

export function useGanttContext<TData>(): GanttContext<TData> {
	const context = useContext(GanttContext) as GanttContext<TData> | null;

	if (!context) {
		throw new Error('No GanttProvider in component tree')
	}

	return context;
}