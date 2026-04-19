import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@firebase-oss/ui-styles/dist.min.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { queryClient } from '@/api/queryClient';
import { ModalsProvider } from '@mantine/modals';
import { FirebaseUIProvider } from '@firebase-oss/ui-react';
import { initializeUI, requireDisplayName } from '@firebase-oss/ui-core';
import { firebase, firebaseAuth } from '@/api/auth/firebase';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { useEffect } from 'react';
import { http } from '@/base/http';

const firebaseUI = initializeUI({
	app: firebase,
	auth: firebaseAuth,
	behaviors: [
		requireDisplayName()
	]
})


export function App() {
	const user = useFirebaseUser();

	useEffect(() => {
		if (user) {
			user.getIdToken().then(jwt => http.setAuthToken(jwt));
		} else {
			http.setAuthToken(null);
		}
	}, [user]);

	return (
		<FirebaseUIProvider ui={firebaseUI}>
			<QueryClientProvider client={queryClient}>
				<MantineProvider>
					<ModalsProvider>
						<Notifications />
						<RouterProvider router={router} />
					</ModalsProvider>
				</MantineProvider>
			</QueryClientProvider>
		</FirebaseUIProvider>
	);
}

export default App;