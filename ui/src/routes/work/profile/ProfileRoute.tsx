import { Avatar, Button, LoadingOverlay, Popover, Stack, Text } from '@mantine/core';
import { useUserQuery } from '@/api/auth/useUserQuery';
import { IconAt, IconLock, IconTrash } from '@tabler/icons-react';
import { useDeleteUserMutation } from '@/api/auth/useDeleteUserMutation';
import { firebaseAuth } from '@/api/auth/firebase';

export function ProfileRoute() {
	const userQuery = useUserQuery();
	const deleteUserMutation = useDeleteUserMutation();

	const deleteUser = () => {
		deleteUserMutation.mutateAsync()
			.then(() => firebaseAuth.signOut());
	}

	if (userQuery.isLoading || !userQuery.data) {
		return <LoadingOverlay visible={true} />
	}

	return (
		<Stack gap='xs' p="lg" align={'center'}>
			<Avatar src={userQuery.data.picture} radius='xl' size='xl' alt={ userQuery.data.displayName ?? userQuery.data.email } />
			<Text c="dark" fw={500}>
				{ userQuery.data?.displayName ?? userQuery.data.email }
			</Text>

			<Text c="dimmed">
				{ userQuery.data.email }
			</Text>

			<Button variant='light' leftSection={<IconAt size={16} />}>Change e-mail</Button>
			<Button variant='light' leftSection={<IconLock size={16} />}>Change password</Button>
			<Popover width={400} withArrow shadow='md'>
				<Popover.Target>
					<Button variant='light' color='red' leftSection={<IconTrash size={16} />} loading={deleteUserMutation.isPending}>Delete account</Button>
				</Popover.Target>
				<Popover.Dropdown>
					<Text c='red' size='sm' fw={500}>Are you sure you want to delete your account?</Text>
					<Text size='sm' mb='md'>This action will permanently delete your account and all associated data. It can't be undone.</Text>
					<Button variant='light' size='sm' color='red' loading={deleteUserMutation.isPending} onClick={deleteUser}>Delete account</Button>
				</Popover.Dropdown>
			</Popover>
		</Stack>
	)
}