import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { queryClient } from '@/api/queryClient';


export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider>
				<Notifications />
				<RouterProvider router={router} />
			</MantineProvider>
		</QueryClientProvider>
	);
}

export default App;