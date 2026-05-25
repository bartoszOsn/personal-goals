import { ReactNode } from 'react';
import { cn } from '@/primitive/lib/utils';

export function TimelineRowChart({ children, isSelected }: { children: ReactNode, isSelected: boolean }) {
	return (
		<div className={cn('flex-1 relative border-b', isSelected && 'bg-input border-b-accent')}>
			{children}
		</div>
	)
}