import { DefaultError } from '@tanstack/react-query';
import { useQueryError } from '@/base/query-x/api/useQueryError.ts';
import { useMutationError } from '@/base/query-x/api/useMutationError.ts';

export function useQueryOrMutationError(handler: (err: DefaultError) => void) {
	useQueryError(handler);
	useMutationError(handler);
}