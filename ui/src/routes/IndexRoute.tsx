import { Navigate } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';

export function IndexRoute() {
	return (
		<Navigate to={'/work/$context/sprint-overview'} params={{ context: Temporal.Now.plainDateISO().year.toString() }} />
	)
}