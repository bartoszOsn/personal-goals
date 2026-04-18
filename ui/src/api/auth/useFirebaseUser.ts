import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/api/auth/firebase.ts';

export function useFirebaseUser() {
	const [currentUser, setCurrentUser] = useState(firebaseAuth.currentUser);

	useEffect(() => {
		return firebaseAuth.onAuthStateChanged(setCurrentUser);
	}, []);

	return currentUser;
}