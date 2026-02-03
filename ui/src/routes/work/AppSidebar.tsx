import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem
} from '@/components/ui/sidebar.tsx';
import { Link, type LinkOptions } from '@tanstack/react-router';
import type { ReactNode } from 'react';

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				Personal OKR
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<MenuLink href='/work/okrs'>OKRs</MenuLink>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<MenuLink href='/work/okrs/progress-matrix'>Progress matrix</MenuLink>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<MenuLink href='/work/tasks'>Tasks</MenuLink>
								<SidebarMenuSub>
									<SidebarMenuSubItem>
										<MenuLink href='/work/tasks/backlog'>Backlog</MenuLink>
									</SidebarMenuSubItem>
									<SidebarMenuSubItem>
										<MenuLink href='/work/tasks/calendar'>Calendar</MenuLink>
									</SidebarMenuSubItem>
								</SidebarMenuSub>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Settings</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<MenuLink href='/work/sprint-settings'>Sprint settings</MenuLink>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				Username
			</SidebarFooter>
		</Sidebar>
	)
}

function MenuLink({ href, children }: { href: LinkOptions['to'], children: ReactNode }) {
	return (
		<SidebarMenuButton asChild>
			<Link to={href} activeProps={{ className: 'font-bold'}}>{children}</Link>
		</SidebarMenuButton>
	)
}