import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/api/auth/firebase.ts';

export function useFirebaseAuthReady() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		firebaseAuth.authStateReady().then(() => setReady(true));
	}, []);

	return ready;
}