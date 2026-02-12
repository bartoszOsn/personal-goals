import type { QuarterDTO } from '@personal-okr/shared';
import type { MantineColor } from '@mantine/core';

export const quarterToColor: Record<QuarterDTO, MantineColor> = {
	Q1: 'green',
	Q2: 'yellow',
	Q3: 'orange',
	Q4: 'gray',
}