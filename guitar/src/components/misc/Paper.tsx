import './paper.scss';
import { ReactNode } from 'react';

export interface PaperProps {
	children?: ReactNode;
}

export function Paper({ children }: PaperProps) {
	return (
		<div className='gui-paper'>
			{children}
		</div>
	)
}