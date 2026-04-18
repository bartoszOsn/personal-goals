import { HttpError } from '@/base/http';
import { firebaseAuth } from '@/api/auth/firebase';

export function handleUnauthorizedError(err: HttpError) {
	if (err.statusCode === 401) {
		firebaseAuth.signOut().then();
	}
}

export function defaultRetry(count: number, err: HttpError) {
	if (err.statusCode === 401) {
		return false;
	}
	return count < 3;
}
