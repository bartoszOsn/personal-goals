import { ForgotPasswordAuthScreen } from '@firebase-oss/ui-react';
import { useNavigate } from '@tanstack/react-router';

export function ForgotPasswordRoute() {
	const navigate = useNavigate();

	return (
		<ForgotPasswordAuthScreen onBackToSignInClick={() => navigate({ to: '/auth/login'})} />
	)
}