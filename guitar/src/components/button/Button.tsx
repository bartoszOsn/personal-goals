import './button.scss';
import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'neutral' | 'primary';
	weight?: 'default' | 'subtle' | 'transparent';
	size?: 'compact' | 'default' | 'large';
}

export function Button({ variant = 'neutral', size = 'default', ...baseProps }: ButtonProps) {
	return (
		<button className={`gui-button ${variantToClass[variant]} ${sizeToClass[size]}`} {...baseProps}>
			Button
		</button>
	);
}

const variantToClass: Record<NonNullable<ButtonProps['variant']>, string> = {
	primary: 'gui-button--primary',
	neutral: 'gui-button--neutral',
}

const sizeToClass: Record<NonNullable<ButtonProps['size']>, string> = {
	compact: 'gui-button--compact',
	default: 'gui-button--default',
	large: 'gui-button--large',
}