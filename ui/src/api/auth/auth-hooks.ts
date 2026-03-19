import { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '@personal-okr/shared';
import { http } from '@/base/http';
import { setToken } from '@/api/auth/query-auth.ts';
import { createMutation } from '@/base/query-x/api/createMutation';

export const useLoginMutation = createMutation((queryClient) => ({
	mutationKey: ['auth', 'login'],
	mutationFn: (request: LoginRequestDTO) => http.post<AuthResponseDTO, LoginRequestDTO>('/api/auth/login', request),
	onSuccess: (data: AuthResponseDTO) => {
		setToken(data.accessToken, queryClient);
	}
}));

export const useRegisterMutation = createMutation((queryClient) => ({
	mutationKey: ['auth', 'register'],
	mutationFn: (request: RegisterRequestDTO) => http.post<AuthResponseDTO, RegisterRequestDTO>('/api/auth/register', request),
	onSuccess: (data: AuthResponseDTO) => {
		setToken(data.accessToken, queryClient);
	}
}));
