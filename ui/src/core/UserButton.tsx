import { Avatar, Button, Menu, Skeleton, Stack, Text } from '@mantine/core';
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons-react';
import { firebaseAuth } from '@/api/auth/firebase';
import { createLink } from '@tanstack/react-router';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';

export function UserButton({ context }: { context: number }) {
	const user = useFirebaseUser();

	if (!user) {
		return <Skeleton w='100%' h={40} />
	}

	return (
		<Menu position='right'>
			<Menu.Target>
				<Button variant="subtle"
						rightSection={<IconChevronRight size={14} stroke={1.5} />}
						leftSection={<Avatar
							src={user?.photoURL ?? null}
							radius="xl"
							alt={ user.displayName ?? user.email ?? '' }
						/>}
						fullWidth
						style={{ '--button-height': 'var(--button-height-lg)'}}
						styles={{ label: { maxWidth: '100%' } }}
				>
					<Stack gap={0} align='start' maw='100%'>
						<Text c="dark" size="sm" fw={500} maw='100%' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
							{ user.displayName }
						</Text>

						<Text c="dimmed" size="xs" maw='100%' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
							{ user.email }
						</Text>
					</Stack>
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<MenuItemLink component='a' to='/work/$context/profile' params={{ context: context.toString() }} leftSection={<IconSettings size={14} stroke={1.5} />}>
					Settings
				</MenuItemLink>
				<Menu.Item color='red' leftSection={<IconLogout size={14} stroke={1.5} />} onClick={() => firebaseAuth.signOut()}>
					Logout
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}

const MenuItemLink = createLink(Menu.Item<'a'>);