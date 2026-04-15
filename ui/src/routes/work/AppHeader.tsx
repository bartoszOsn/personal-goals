import { AppShell, Burger, Group, Image, Text } from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import { YearPickerInput } from '@mantine/dates';
import { Temporal } from 'temporal-polyfill';

export function AppHeader({ context, setContext, navbarCollapsed, setNavbarCollapsed }: {
	context: number,
	setContext: (next: number) => void,
	navbarCollapsed: boolean,
	setNavbarCollapsed: (value: boolean) => void,
}) {
	const contextSwitcherValue = new Temporal.PlainDate(context, 1, 1).toString();
	const onContextChange = (value: string | null) => {
		if (!value) return;
		const newValue = Temporal.PlainDate.from(value).year;
		setContext(newValue);
	};

	return (
		<AppShell.Header>
			<Group px='md' py='xs' gap='md' justify='space-between' wrap='nowrap'>
				<Group gap='xs' wrap='nowrap' style={{ cursor: 'default', userSelect: 'none' }}>
					<Burger size='sm' opened={!navbarCollapsed} onClick={() => setNavbarCollapsed(!navbarCollapsed)} />
					<Image src='/logo.svg' w={24} h={24} />
					<Text fw='bold' visibleFrom='sm' c='grape' style={{ textWrap: 'nowrap' }}>Personal Goals</Text>
				</Group>

				<YearPickerInput value={contextSwitcherValue}
								 miw={200}
								 size='xs'
								 leftSection={<IconCalendar size={18} stroke={1.5} />}
								 leftSectionPointerEvents="none"
								 onChange={onContextChange} />
			</Group>
		</AppShell.Header>
	);
}