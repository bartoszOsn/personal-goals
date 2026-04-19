import { Avatar, Button, Menu, Skeleton, Stack, Text } from '@mantine/core';
import { IconChevronRight, IconLogout, IconSettings } from '@tabler/icons-react';
import { useUserQuery } from '@/api/auth/useUserQuery';
import { firebaseAuth } from '@/api/auth/firebase';

export function UserButton() {
	const userQuery = useUserQuery();

	if (userQuery.isLoading || !userQuery.data) {
		return <Skeleton w='100%' h={40} />
	}

	return (
		<Menu position='right'>
			<Menu.Target>
				<Button variant="subtle"
						rightSection={<IconChevronRight size={14} stroke={1.5} />}
						leftSection={<Avatar
							src={userQuery.data?.picture ?? null}
							radius="xl"
							alt={ userQuery.data.displayName ?? userQuery.data.email }
						/>}
						fullWidth
						style={{ '--button-height': 'var(--button-height-lg)'}}
						styles={{ label: { maxWidth: '100%' } }}
				>
					<Stack gap={0} align='start' maw='100%'>
						<Text c="dark" size="sm" fw={500} maw='100%' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
							{ userQuery.data?.displayName ?? userQuery.data.email }
						</Text>

						<Text c="dimmed" size="xs" maw='100%' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
							{ userQuery.data.email }
						</Text>
					</Stack>
				</Button>
			</Menu.Target>
			<Menu.Dropdown>
				<Menu.Item leftSection={<IconSettings size={14} stroke={1.5} />}>
					Settings
				</Menu.Item>
				<Menu.Item color='red' leftSection={<IconLogout size={14} stroke={1.5} />} onClick={() => firebaseAuth.signOut()}>
					Logout
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
}