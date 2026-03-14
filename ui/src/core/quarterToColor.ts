import { MantineColor } from '@mantine/core';
import { Quarter } from '@/models/Quarter';

export const quarterToColor: Record<Quarter, MantineColor> = {
	Q1: 'green',
	Q2: 'yellow',
	Q3: 'orange',
	Q4: 'gray',
}