import z from 'zod';

export const WorkItemTypeDTOSchemaOld = z.enum(['task', 'objective', 'keyResult']);

export type WorkItemTypeDTOOld = z.infer<typeof WorkItemTypeDTOSchemaOld>;
