import { z } from 'zod';

export const WorkItemProgressDTOSchema = z.object({
	completed: z.int().min(0).max(100),
	failed: z.int().min(0).max(100),
});

export type WorkItemProgressDTO = z.infer<typeof WorkItemProgressDTOSchema>;