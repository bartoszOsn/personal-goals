import { Link, LinkOptions } from '@tanstack/react-router';
import { AppShell, Box, NavLink, type NavLinkProps, Title } from '@mantine/core';

export function AppSidebar() {
	return (
		<AppShell.Navbar>
			<Box p='md'>
				<Title order={3} pb='lg'>
					Personal OKR
				</Title>
				<CustomNavLink href='/work/sprint-overview/{-$sprintId}' label='Sprint overview' exact={ false } />
				<CustomNavLink href='/work/roadmap-v2/{-$context}' label='Roadmap' exact={ false } />
				<CustomNavLink href='/work/sprint-settings' label='Sprint settings' />
			</Box>
		</AppShell.Navbar>
	)
}

// function CustomNavLinkGroup({ label, ...nativeProps }: { label: string } & Omit<NavLinkProps, 'Component' | 'label' | 'defaultOpened'>) {
// 	return <NavLink {...nativeProps} label={<Text c='gray'>{label}</Text>} href='#' defaultOpened />;
// }

function CustomNavLink({ href, exact = true, ...nativeProps }: { href: LinkOptions['to'], exact?: boolean } & Omit<NavLinkProps, 'Component'>) {
	return (
		<NavLink
			{...nativeProps}
			to={href}
			component={Link}
			activeOptions={{ exact }}
		/>
	);
}
