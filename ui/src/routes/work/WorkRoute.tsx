import { SidebarProvider, SidebarTrigger } from '@/base/components/ui/sidebar.tsx';
import { Outlet } from '@tanstack/react-router';
import { AppSidebar } from '@/routes/work/AppSidebar.tsx';

export function WorkRoute() {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main>
				<SidebarTrigger />
				<Outlet />
			</main>
		</SidebarProvider>
	)
}