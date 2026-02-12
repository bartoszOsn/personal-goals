import type { GanttProps } from '@/base/gantt/GanttProps.ts';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import type { RowPositionInfo } from '@/base/gantt/model/RowPositionInfo';

export interface GanttContext<TData> {
	props: GanttProps<TData>;
	rows: RowPositionInfo[];
	setRows(rows: RowPositionInfo[]): void;
	scrollAreaHeight: number;
	setScrollAreaHeight(scrollAreaHeight: number): void;
	scrollY: number;
	setScrollY(scrollY: number): void;
}

const GanttContext = createContext<GanttContext<unknown> | null>(null);

export interface GanttProviderProps<TData> {
	props: GanttProps<TData>;
	children: ReactNode;
}

export function GanttProvider<TData>(props: GanttProviderProps<TData>) {
	const [rows, setRows] = useState<RowPositionInfo[]>([]);
	const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
	const [scrollY, setScrollY] = useState(0);

	const context = useMemo(() => ({
		props: props.props,
		rows, setRows,
		scrollAreaHeight, setScrollAreaHeight,
		scrollY, setScrollY
	}), [props.props, rows, setRows, scrollAreaHeight, setScrollAreaHeight, scrollY, setScrollY])

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