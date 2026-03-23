import z from 'zod';

export const WorkItemTypeDTOSchema = z.enum(['task', 'objective', 'keyResult']);

export type WorkItemTypeDTO = z.infer<typeof WorkItemTypeDTOSchema>;
