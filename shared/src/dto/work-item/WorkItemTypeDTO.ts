import z from 'zod';

export const WorkItemTypeDTOSchema = z.enum(['group', 'goal', 'task']);

export type WorkItemTypeDTO = z.infer<typeof WorkItemTypeDTOSchema>;
