import { ReactNode } from 'react';

export function TimelineRow({
	children,
	isSelected,
	onClick
}: {
	children: ReactNode,
	isSelected: boolean;
	onClick: (withShift: boolean) => void;
}) {
	return (
		<div className={`not-last:border-b flex flex-row flex-nowrap bg-accent min-h-8 ${isSelected ? 'bg-input not-last:border-background' : ''}`}
			onClick={(e) => {
				onClick(e.shiftKey);
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{children}
		</div>
	)
}