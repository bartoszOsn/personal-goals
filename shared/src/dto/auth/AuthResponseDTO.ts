import { z } from 'zod';

export const AuthResponseDTOSchema = z.object({
	accessToken: z.string(),
	userId: z.string(),
})

export type AuthResponseDTO = z.infer<typeof AuthResponseDTOSchema>;
