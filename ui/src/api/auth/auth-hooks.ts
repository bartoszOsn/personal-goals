import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '@personal-okr/shared';
import { http } from '@/base/http';
import { setToken } from '@/api/auth/query-auth.ts';

export function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['auth', 'login'],
		mutationFn: (request: LoginRequestDTO) => http.post<AuthResponseDTO, LoginRequestDTO>('/api/auth/login', request),
		onSuccess: (data) => {
			setToken(data.accessToken, queryClient);
		}
	});
}

export function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ['auth', 'register'],
		mutationFn: (request: RegisterRequestDTO) => http.post<AuthResponseDTO, RegisterRequestDTO>('/api/auth/register', request),
		onSuccess: (data) => {
			setToken(data.accessToken, queryClient);
		}
	})
}