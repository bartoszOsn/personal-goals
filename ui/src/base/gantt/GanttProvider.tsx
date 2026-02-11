import type { GanttProps } from '@/base/gantt/GanttProps.ts';
import { createContext, type ReactNode, useContext } from 'react';

export interface GanttContext<TData> {
	props: GanttProps<TData>;
}

const GanttContext = createContext<GanttContext<unknown> | null>(null);

export interface GanttProviderProps<TData> {
	props: GanttProps<TData>;
	children: ReactNode;
}

export function GanttProvider<TData>(props: GanttProviderProps<TData>) {
	return (
		<GanttContext.Provider value={{ props: props.props }}>
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