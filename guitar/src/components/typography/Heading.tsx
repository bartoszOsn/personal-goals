import './Heading.scss';
import { ReactNode } from 'react';

export interface HeadingProps {
	children?: ReactNode
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ children, level = 1 }: HeadingProps) {
	const Component = levelToComponent[level];

	return (
		<Component className="gui-heading">
			{children}
		</Component>
	)
}

const levelToComponent = {
	1: 'h1',
	2: 'h2',
	3: 'h3',
	4: 'h4',
	5: 'h5',
	6: 'h6',
} as const satisfies Record<NonNullable<HeadingProps['level']>, string>;