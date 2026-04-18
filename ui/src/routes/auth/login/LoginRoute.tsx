import { SignInAuthScreen, GoogleSignInButton,  } from '@firebase-oss/ui-react';
import { useNavigate } from '@tanstack/react-router';

export function LoginRoute() {
	const navigate = useNavigate();

	return (
		<SignInAuthScreen onSignUpClick={() => navigate({ to: '/auth/register'})}
						  onForgotPasswordClick={() => {}}>
			<GoogleSignInButton />
		</SignInAuthScreen>
	);
}