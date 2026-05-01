import { Button, ButtonProps } from '../src/components/button';

export function Buttons() {
	const variants: ButtonProps['variant'][] = ['primary', 'neutral'];
	const weights: ButtonProps['weight'][] = ['default', 'subtle', 'transparent'];
	const sizes: ButtonProps['size'][] = ['compact', 'default', 'large'];

	return (
		sizes.map(size => (
			<div>
				<h2>Size: {size}</h2>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					{
						variants.map(variant => (
							<div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
								{
									weights.map(weight => (
										<Button variant={variant} weight={weight} size={size}>Click me</Button>
									))
								}
							</div>
						))
					}
				</div>
			</div>
		))
	)
}