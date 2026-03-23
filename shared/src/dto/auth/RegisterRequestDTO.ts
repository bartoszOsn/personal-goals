import { z } from 'zod';

export const RegisterRequestDTOSchema = z.object({
	email: z.string(),
	password: z.string()
})

export type RegisterRequestDTO  = z.infer<typeof RegisterRequestDTOSchema>;
