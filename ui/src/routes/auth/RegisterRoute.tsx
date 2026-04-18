import { useNavigate } from '@tanstack/react-router';
import { GoogleSignInButton, SignUpAuthScreen } from '@firebase-oss/ui-react';

export function RegisterRoute() {
	const navigate = useNavigate();

	return (
		<SignUpAuthScreen onSignInClick={() => navigate({ to: '/auth/login'})}>
			<GoogleSignInButton />
		</SignUpAuthScreen>
	);
}