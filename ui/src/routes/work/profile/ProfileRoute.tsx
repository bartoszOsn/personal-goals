import { Avatar, Button, LoadingOverlay, Popover, Stack, Text } from '@mantine/core';
import { IconAt, IconLock, IconTrash } from '@tabler/icons-react';
import { useDeleteUserMutation } from '@/api/auth/useDeleteUserMutation';
import { firebaseAuth } from '@/api/auth/firebase';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';

export function ProfileRoute() {
	const user = useFirebaseUser();
	const deleteUserMutation = useDeleteUserMutation();

	const deleteUser = () => {
		deleteUserMutation.mutateAsync()
			.then(() => firebaseAuth.signOut());
	}

	if (!user) {
		return <LoadingOverlay visible={true} />
	}

	return (
		<Stack gap='xs' p="lg" align={'center'}>
			<Avatar src={user.photoURL} radius='xl' size='xl' alt={ user.displayName ?? user.email ?? '' } />
			<Text c="dark" fw={500}>
				{ user.displayName ?? user.email }
			</Text>

			<Text c="dimmed">
				{ user.email }
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