import { Navigate } from '@tanstack/react-router';

export function IndexRoute() {
	return (
		<Navigate to={'/work'} />
	)
}