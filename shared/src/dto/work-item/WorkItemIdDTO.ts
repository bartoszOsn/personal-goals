import { z } from 'zod';

export const WorkItemIdDTOSchema = z.uuid();

export type WorkItemIdDTO = z.infer<typeof WorkItemIdDTOSchema>;