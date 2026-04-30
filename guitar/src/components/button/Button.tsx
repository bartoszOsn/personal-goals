import './button.scss';
import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'neutral' | 'primary';
}

export function Button({ variant = 'neutral', ...baseProps }: ButtonProps) {
	return (
		<button className={`gui-button ${variantToClass[variant]}`} {...baseProps}>
			Button
		</button>
	);
}

const variantToClass: Record<NonNullable<ButtonProps['variant']>, string> = {
	primary: 'gui-button--primary',
	neutral: 'gui-button--neutral',
}
