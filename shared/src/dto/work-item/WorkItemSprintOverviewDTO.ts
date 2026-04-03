import { z } from 'zod';
import { SprintIdDTOSchema } from '../sprint/SprintDTO.js';
import { WorkItemDTOSchema } from './WorkItemDTO.js';

export const WorkItemSprintOverviewDTOSchema = z.object({
	sprintId: SprintIdDTOSchema,
	tasks: z.array(WorkItemDTOSchema)
});

export type WorkItemSprintOverviewDTO = z.infer<typeof WorkItemSprintOverviewDTOSchema>;