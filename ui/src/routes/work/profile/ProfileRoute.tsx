import { Avatar, Button, Group, LoadingOverlay, Modal, Popover, Stack, Text, TextInput } from '@mantine/core';
import { IconAt, IconLock, IconTrash } from '@tabler/icons-react';
import { useDeleteUserMutation } from '@/api/auth/useDeleteUserMutation';
import { firebaseAuth } from '@/api/auth/firebase';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { sendPasswordResetEmail, verifyBeforeUpdateEmail, AuthErrorCodes } from 'firebase/auth';
import { notifications } from '@mantine/notifications';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { FirebaseError } from 'firebase/app';

export function ProfileRoute() {
	const user = useFirebaseUser();
	const deleteUserMutation = useDeleteUserMutation();
	const [showEmailChangeModal, { open: openEmailChangeModal, close: closeEmailChangeModal}] = useDisclosure(false);
	const [newEmail, setNewEmail] = useInputState('');

	const deleteUser = () => {
		deleteUserMutation.mutateAsync()
			.then(() => firebaseAuth.signOut());
	}

	if (!user) {
		return <LoadingOverlay visible={true} />
	}

	const onPasswordReset = async () => {
		if (!user.email) {
			return;
		}

		try {
			await sendPasswordResetEmail(firebaseAuth, user.email, { url: location.href });
			notifications.show({
				title: 'Password reset email sent',
				message: 'Check your inbox for further instructions',
				color: 'blue'
			});
		} catch {
			notifications.show({
				title: 'Failed to send password reset email',
				message: 'Please try again later',
				color: 'red'
			});
		}
	}

	const onChangeEmail = async () => {
		try {
			await verifyBeforeUpdateEmail(user, newEmail, { url: location.href });
			notifications.show({
				title: 'Verification email has been sent',
				message: 'Check your inbox for further instructions',
				color: 'blue'
			});
			closeEmailChangeModal();
		} catch (error) {
			if (error instanceof FirebaseError && error.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
				notifications.show({
					title: 'Credentials too old.',
					message: <>
						<Text inherit>Please log out, log in and try again.</Text>
						<Button size='xs' variant='light' onClick={() => firebaseAuth.signOut()}>Log out</Button>
					</>,
					color: 'red'
				});
			} else {
				notifications.show({
					title: 'Failed to update email',
					message: 'Please try again later',
					color: 'red'
				});
			}

		}
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

			<Button variant='light' leftSection={<IconAt size={16} />} onClick={openEmailChangeModal}>Change e-mail</Button>
			<Modal opened={showEmailChangeModal} onClose={closeEmailChangeModal} title='Change e-mail'>
				<Stack>
					<TextInput type='email' value={newEmail} onInput={setNewEmail} placeholder={user.email ?? undefined} />
					<Group justify={'end'} gap='xs'>
						<Button variant='light' color='gray' onClick={closeEmailChangeModal}>Cancel</Button>
						<Button variant='light' disabled={newEmail === ''} onClick={onChangeEmail}>Save</Button>
					</Group>
				</Stack>
			</Modal>
			<Button variant='light' leftSection={<IconLock size={16} />} onClick={onPasswordReset}>Change password</Button>
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