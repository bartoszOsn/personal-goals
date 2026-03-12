import { createLink } from '@tanstack/react-router';
import { AppShell, Box, Button, NavLink, Title } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { IconCalendar, IconPlus } from '@tabler/icons-react';
import { Temporal } from 'temporal-polyfill';

export function AppSidebar({ context, setContext }: { context: number, setContext: (next: number) => void }) {
	const contextSwitcherValue = new Temporal.PlainDate(context, 1, 1).toString();
	const onContextChange = (value: string | null) => {
		if (!value) return;
		const newValue = Temporal.PlainDate.from(value).year;
		setContext(newValue);
	}

	return (
		<AppShell.Navbar>
			<Box p='md'>
				<YearPickerInput value={contextSwitcherValue}
								 w='100%'
								 mb='xl'
								 leftSection={<IconCalendar size={18} stroke={1.5} />}
								 leftSectionPointerEvents="none"
								 onChange={onContextChange} />
				<Title order={3} pb='lg'>
					Personal OKR
				</Title>
				<CustomNavLink to='/work/$context/sprint-overview/{-$sprintId}' params={{ context: context.toString() }} label='Sprint overview' />
				<CustomNavLink to='/work/$context/roadmap' params={{ context: context.toString() }} label='Roadmap' />
				<NavLink label='Docs'>
					<CustomNavLink to={'/'} label='Doc 1' />
					<CustomNavLink to={'/'} label='Doc 2' />
					<CustomNavLink to={'/'} label='Doc 3' />
					<Button fullWidth color='gray' variant='subtle' leftSection={<IconPlus size={18} stroke={1.5} />}>
						New document
					</Button>
				</NavLink>
				<CustomNavLink to='/work/$context/sprint-settings' params={{ context: context.toString() }} label='Sprint settings' />
			</Box>
		</AppShell.Navbar>
	)
}

const CustomNavLink = createLink(NavLink<'a'>);