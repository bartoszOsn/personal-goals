import '@mantine/core/styles.css';
import '@firebase-oss/ui-styles/dist.min.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.tsx';
import { MantineProvider } from '@mantine/core';
import { queryClient } from '@/api/queryClient';
import { FirebaseUIProvider } from '@firebase-oss/ui-react';
import { initializeUI, requireDisplayName } from '@firebase-oss/ui-core';
import { firebase, firebaseAuth } from '@/api/auth/firebase';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { useEffect } from 'react';
import { http } from '@/base/http';
import { TooltipProvider } from '@/primitive/components/ui/tooltip';
import { DialogManagerProvider } from '@/base/dialog-manager/api/DialogManagerProvider';
import { Toaster } from '@/primitive/components/ui/sonner';

const firebaseUI = initializeUI({
	app: firebase,
	auth: firebaseAuth,
	behaviors: [
		requireDisplayName()
	]
});


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
				<TooltipProvider>
					<MantineProvider>
						<DialogManagerProvider>
							<Toaster />
							<RouterProvider router={router} />
						</DialogManagerProvider>
					</MantineProvider>
				</TooltipProvider>
			</QueryClientProvider>
		</FirebaseUIProvider>
	);
}

export default App;