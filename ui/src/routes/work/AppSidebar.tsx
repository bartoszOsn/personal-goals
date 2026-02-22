import { Link, type LinkOptions } from '@tanstack/react-router';
import { AppShell, Box, NavLink, type NavLinkProps, Text, Title } from '@mantine/core';

export function AppSidebar() {
	return (
		<AppShell.Navbar>
			<Box p='md'>
				<Title order={3} pb='lg'>
					Personal OKR
				</Title>
				<CustomNavLink href='/work/sprint-overview/{-$sprintId}' label='Sprint overview' />
				<CustomNavLinkGroup label='OKRs'>
					<CustomNavLink href='/work/okrs' label='All OKRs' />
					<CustomNavLink href='/work/okrs/progress-matrix' label='Progress matrix' />
				</CustomNavLinkGroup>
				<CustomNavLinkGroup label='Tasks'>
					<CustomNavLink href='/work/tasks' label='Task list' />
					<CustomNavLink href='/work/tasks/backlog' label='Backlog' />
				</CustomNavLinkGroup>
				<CustomNavLink href='/work/sprint-settings' label='Sprint settings' />
			</Box>
		</AppShell.Navbar>
	)
}

function CustomNavLinkGroup({ label, ...nativeProps }: { label: string } & Omit<NavLinkProps, 'Component' | 'label' | 'defaultOpened'>) {
	return <NavLink {...nativeProps} label={<Text c='gray'>{label}</Text>} href='#' defaultOpened />;
}

function CustomNavLink({ href, ...nativeProps }: { href: LinkOptions['to'] } & Omit<NavLinkProps, 'Component'>) {
	return (
		<NavLink
			{...nativeProps}
			to={href}
			component={Link}
			activeOptions={{ exact: true }}
		/>
	);
}
