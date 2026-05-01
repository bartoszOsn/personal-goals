import './button.scss';
import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'neutral' | 'primary';
	weight?: 'default' | 'subtle' | 'transparent';
	size?: 'compact' | 'default' | 'large';
}

export function Button({ variant = 'neutral', size = 'default', weight = 'default', ...baseProps }: ButtonProps) {
	return (
		<button className={`gui-button ${variantToClass[variant]} ${sizeToClass[size]} ${weightToClass[weight]}`}
				{...baseProps}>
			Button
		</button>
	);
}

const variantToClass: Record<NonNullable<ButtonProps['variant']>, string> = {
	primary: 'gui-button--primary',
	neutral: 'gui-button--neutral',
}

const weightToClass: Record<NonNullable<ButtonProps['weight']>, string> = {
	default: 'gui-button--weight-default',
	subtle: 'gui-button--weight-subtle',
	transparent: 'gui-button--weight-transparent'
}

const sizeToClass: Record<NonNullable<ButtonProps['size']>, string> = {
	compact: 'gui-button--size-compact',
	default: 'gui-button--size-default',
	large: 'gui-button--size-large',
}