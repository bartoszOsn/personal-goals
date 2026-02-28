import { Anchor, Button, Card, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useLoginMutation } from '@/api/auth/auth-hooks';
import { Link } from '@tanstack/react-router';

export function LoginRoute() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const loginMutation = useLoginMutation();

	const handleLogin = () => {
		loginMutation.mutate({ email, password });
	};

	return (
		<Card>
			<Stack w="100%">
				<Text fw={500} size="lg" mt="md">
					Sign in
				</Text>
				<TextInput
					label="Email"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
				/>
				<PasswordInput
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.currentTarget.value)}
				/>
				<Button
					onClick={handleLogin}
					disabled={!email || !password}
					loading={loginMutation.isPending}
				>Sign in</Button>
				<Anchor component={Link} to='/auth/register'>
					Don't have an account? Sign up
				</Anchor>
			</Stack>
		</Card>
	);
}