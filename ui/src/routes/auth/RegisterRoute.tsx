import { useState } from 'react';
import { useRegisterMutation } from '@/api/auth-hooks.ts';
import { Anchor, Button, Card, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export function RegisterRoute() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const registerMutation = useRegisterMutation();

	const handleRegister = () => {
		registerMutation.mutate({ email, password });
	};

	return (
		<Card>
			<Stack w="100%">
				<Text fw={500} size="lg" mt="md">
					Sign up
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
				<PasswordInput
					label="Repeat Password"
					value={repeatPassword}
					onChange={(e) => setRepeatPassword(e.currentTarget.value)}
				/>
				<Button
					onClick={handleRegister}
					disabled={!email || !password || password !== repeatPassword}
					loading={registerMutation.isPending}
				>Sign up</Button>
				<Anchor component={Link} to='/auth/login'>
					Have an account? Sign in
				</Anchor>
			</Stack>
		</Card>
	);
}