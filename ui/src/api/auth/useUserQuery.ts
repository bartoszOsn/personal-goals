import { createQuery } from '@/base/query-x/api/createQuery.ts';
import { UserDTO } from '@personal-okr/shared';
import { http } from '@/base/http';

export const useUserQuery = createQuery(() => ({
	queryKey: ['user'],
	queryFn: async () => getUser()
}));

function getUser(): Promise<UserDTO> {
	return http.get<UserDTO>(`/api/user-info`);
}