import { z } from 'zod';

export const UserDTOSchema = z.object({
	displayName: z.string().optional(),
	email: z.string().optional(),
	picture: z.string().optional(),
});

export type UserDTO = z.infer<typeof UserDTOSchema>;