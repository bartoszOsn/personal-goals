import { SidebarProvider, SidebarTrigger } from '@/base/components/ui/sidebar.tsx';
import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';

export function WorkRoute() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='relative pt-12 px-8'>
				<SidebarTrigger className='absolute top-2 left-2' />
				<Outlet />
			</main>
		</SidebarProvider>
	)
}