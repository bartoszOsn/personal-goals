import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { queryClient } from '@/api/queryClient';
import { ModalsProvider } from '@mantine/modals';


export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider>
				<ModalsProvider>
					<Notifications />
					<RouterProvider router={router} />
				</ModalsProvider>
			</MantineProvider>
		</QueryClientProvider>
	);
}

export default App;