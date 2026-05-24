import { useDeleteUserMutation } from '@/api/auth/useDeleteUserMutation';
import { firebaseAuth } from '@/api/auth/firebase';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { AuthErrorCodes, sendPasswordResetEmail, verifyBeforeUpdateEmail } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { PageContent, PageContentContent, PageContentHeader } from '@/base/PageContent';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/primitive/components/ui/empty';
import { Avatar, AvatarFallback, AvatarImage } from '@/primitive/components/ui/avatar';
import { Button } from '@/primitive/components/ui/button';
import { AtSignIcon, LockIcon, TrashIcon } from 'lucide-react';
import { Spinner } from '@/primitive/components/ui/spinner';
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from '@/primitive/components/ui/popover';
import { Skeleton } from '@/primitive/components/ui/skeleton';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/primitive/components/ui/dialog';
import { Input } from '@/primitive/components/ui/input';
import { Field, FieldLabel } from '@/primitive/components/ui/field';
import { useState } from 'react';
import { toast } from 'sonner';

export function ProfileRoute() {
	const user = useFirebaseUser();
	const deleteUserMutation = useDeleteUserMutation();
	const [showEmailChangeModal, setShowEmailChangeModal] = useState(false);
	const [newEmail, setNewEmail] = useState('');

	const deleteUser = () => {
		deleteUserMutation.mutateAsync()
			.then(() => firebaseAuth.signOut());
	}

	if (!user) {
		return <PageContent>
			<PageContentHeader>Profile settings</PageContentHeader>
			<PageContentContent>
				<div className='w-full flex flex-col items-center p-8 gap-2'>
					<Skeleton className='size-10 rounded-full mb-4' />
					<Skeleton className='h-6 w-36' />
					<Skeleton className='h-4 w-48 mb-4' />
					<Skeleton className='h-6 w-36' />
					<Skeleton className='h-6 w-40' />
					<Skeleton className='h-6 w-36' />
				</div>
			</PageContentContent>
		</PageContent>
	}

	const onPasswordReset = async () => {
		if (!user.email) {
			return;
		}

		try {
			await sendPasswordResetEmail(firebaseAuth, user.email, { url: location.href });
			toast.info('Password reset email sent.', {description: 'Check your inbox for further instructions.' });
		} catch {
			toast.error('Failed to send password reset email.', {description: 'Try again later.' });
		}
	}

	const onChangeEmail = async () => {
		try {
			await verifyBeforeUpdateEmail(user, newEmail, { url: location.href });
			toast.info('Verification email has been sent.', {description: 'Check your inbox for further instructions.' });
			setShowEmailChangeModal(false);
		} catch (error) {
			if (error instanceof FirebaseError && error.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN) {
				toast.error('Credentials too old.', {
					description: 'Please log out, then log in and try again.',
					action: {
						label: 'Log out',
						onClick: () => firebaseAuth.signOut()
					}
				});
			} else {
				toast.error('Failed to update email.', {description: 'Please try again later.' });
			}

		}
	}

	return (
		<PageContent>
			<PageContentHeader>
				Profile settings
			</PageContentHeader>
			<PageContentContent>
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant='icon'>
							<Avatar size='lg'>
								<AvatarImage src={user?.photoURL ?? undefined} />
								<AvatarFallback>{(user.displayName ?? user.email ?? '')[0]}</AvatarFallback>
							</Avatar>
						</EmptyMedia>
						<EmptyTitle>
							{ user.displayName ?? user.email }
						</EmptyTitle>
						<EmptyDescription>
							{ user.email }
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Dialog open={showEmailChangeModal} onOpenChange={setShowEmailChangeModal}>
							<DialogTrigger asChild>
								<Button variant='outline'>
									<AtSignIcon /> Change e-mail
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogTitle>Change e-mail</DialogTitle>
								<div className='flex flex-col gap-4'>
									<Field>
										<FieldLabel>E-mail</FieldLabel>
										<Input type='email' value={newEmail} onInput={(e) => setNewEmail(e.currentTarget.value)} placeholder={user.email ?? undefined} />
									</Field>

									<div className='flex flex-row justify-end gap-2'>
										<DialogClose asChild>
											<Button variant='outline'>Cancel</Button>
										</DialogClose>
										<Button disabled={newEmail === ''} onClick={onChangeEmail}>Save</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
						<Button variant='outline' onClick={onPasswordReset}>
							<LockIcon /> Change password
						</Button>
						<Popover>
							<PopoverTrigger asChild>
								<Button variant='destructive' color='red' disabled={deleteUserMutation.isPending}>
									{
										deleteUserMutation.isPending
											? <Spinner />
											: <TrashIcon />
									}
									Delete account
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								<PopoverTitle>
									Are you sure you want to delete your account?
								</PopoverTitle>
								<PopoverDescription>
									This action will permanently delete your account and all associated data. It can't be undone.
								</PopoverDescription>
								<Button variant='destructive' size='sm' color='red' disabled={deleteUserMutation.isPending} onClick={deleteUser}>
									{
										deleteUserMutation.isPending && <Spinner />
									}
									Delete account
								</Button>
							</PopoverContent>
						</Popover>
					</EmptyContent>
				</Empty>
			</PageContentContent>
		</PageContent>
	)
}