import { Navigate } from '@tanstack/react-router';
import { Temporal } from 'temporal-polyfill';

export function IndexRoute() {
	return (
		<Navigate to={'/work/$context/sprint-overview/{-$sprintId}'} params={{ context: Temporal.Now.plainDateISO().year.toString() }} />
	)
}