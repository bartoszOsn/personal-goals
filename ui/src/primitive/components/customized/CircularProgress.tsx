import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/primitive/lib/utils';

const circularProgressVariants = cva(
	'',
	{
		variants: {
			size: {
				default: 'w-10 h-10',
				sm: 'w-6 h-6',
				lg: 'w-16 h-16'
			}
		},
		defaultVariants: {
			size: 'default'
		}
	}
);

export function CircularProgress({
	values,
	className,
	size = 'default',
	...rest
}: {
	values: { value: number, strokeClass?: string }[]
} & VariantProps<typeof circularProgressVariants> & Omit<ComponentProps<'svg'>, 'values'>) {
	const radius = 20;
	const circumference = Math.ceil(3.14 * radius * 2);
	const resolvedValues = values.reduce(((prev, value) => {
		const strokeClass = value.strokeClass ?? 'stroke-primary';
		const strokeDasharray = Math.ceil(circumference * ((100 - value.value) / 100));
		const rotation = Math.round(prev.reduce((acc, { value }) => acc + value, 0) / 100 * 360) - 90;

		return [...prev, { value: value.value, strokeClass, strokeDasharray, rotation }];
	}), [] as { value: number, strokeClass: string, strokeDasharray: number, rotation: number }[])
		.reverse();

	return <svg viewBox="0 0 48 48" className={cn(circularProgressVariants({ size, className}))} {...rest}>
		<circle cx={24} cy={24} r={radius} className="fill-transparent stroke-muted stroke-4" />
		{
			resolvedValues.map((value, index) => (
				<circle key={index}
										   cx={24}
										   cy={24}
										   r={radius}
										   strokeDasharray={circumference}
										   strokeDashoffset={value.strokeDasharray}
										   className={cn('fill-transparent stroke-4 transition-all duration-300', value.strokeClass)}
										   style={{ transform: `rotate(${value.rotation}deg)`, transformOrigin: 'center' }} />
			))
		}
	</svg>;
}