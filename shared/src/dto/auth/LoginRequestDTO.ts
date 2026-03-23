import { z } from 'zod';

export const LoginRequestDTOSchema = z.object({
	email: z.string(),
	password: z.string()
});

export type LoginRequestDTO = z.infer<typeof LoginRequestDTOSchema>;