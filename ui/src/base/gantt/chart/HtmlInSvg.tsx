import { ReactNode } from 'react';

export interface HtmlInSvgProps {
	children: ReactNode;
	x?: number | string;
	y?: number | string;
	width?: number | string;
	height?: number | string;
}

export function HtmlInSvg(props: HtmlInSvgProps) {
	return (
		<foreignObject x={props.x} y={props.y} width={props.width} height={props.height}>
			{props.children}
		</foreignObject>
	);
}
