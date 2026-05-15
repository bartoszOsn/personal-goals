import { IconChevronRight } from '@tabler/icons-react';
import { firebaseAuth } from '@/api/auth/firebase';
import { Link } from '@tanstack/react-router';
import { useFirebaseUser } from '@/api/auth/useFirebaseUser';
import { Skeleton } from '@/primitive/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/primitive/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/primitive/components/ui/avatar';
import { useIsMobile } from '@/primitive/hooks/use-mobile';

export function UserButton({ context }: { context: number }) {
	const user = useFirebaseUser();
	const isMobile = useIsMobile();

	if (!user) {
		return <Skeleton className='w-full h-10' />
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className='flex items-center cursor-pointer p-2.5 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50'>
					<div className='flex-1 items-center flex gap-2'>
						<Avatar>
							<AvatarImage src={user?.photoURL ?? undefined} />
							<AvatarFallback>{(user.displayName ?? user.email ?? '')[0]}</AvatarFallback>
						</Avatar>
						<div className='flex flex-col items-start max-w-full'>
							<p className='text-sm font-medium max-w-full overflow-hidden text-ellipsis'>
								{ user.displayName }
							</p>
							<p className='text-xs text-muted-foreground max-w-full overflow-hidden text-ellipsis'>
								{ user.email }
							</p>
						</div>
					</div>
					<IconChevronRight size={14} stroke={1.5} />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent side={ isMobile ? 'top' : 'right' }>
				<DropdownMenuItem asChild>
					<Link to='/work/$context/profile' params={{ context: context.toString() }}>
						<Settings /> Settings
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem variant='destructive' onClick={() => firebaseAuth.signOut()}>
					<LogOut /> Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
