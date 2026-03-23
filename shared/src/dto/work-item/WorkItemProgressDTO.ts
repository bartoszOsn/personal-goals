import { z } from 'zod';

export const WorkItemProgressDTOSchema = z.object({
	progress: z.number().min(0).max(100),
	canChange: z.boolean()
});

export type WorkItemProgressDTO = z.infer<typeof WorkItemProgressDTOSchema>;