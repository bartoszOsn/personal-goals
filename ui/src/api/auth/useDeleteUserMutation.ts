import { http } from '@/base/http';
import { createMutation } from '@/base/query-x/api/createMutation.ts';

export const useDeleteUserMutation = createMutation(() => ({
	mutationFn: () => deleteUser()
}));

function deleteUser(): Promise<void> {
	return http.delete(`/api/user-info`);
}