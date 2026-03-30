import { z } from 'zod';

export const WorkItemIdDTOSchemaOld = z.uuid();

export type WorkItemIdDTOOld = z.infer<typeof WorkItemIdDTOSchemaOld>;