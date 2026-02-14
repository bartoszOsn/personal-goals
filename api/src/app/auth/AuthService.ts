import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './AuthRepository';
import { User, UserId } from '../../domain/auth/model/User';

export interface JwtPayload {
	sub: string;
	email: string;
}

export interface AuthResult {
	accessToken: string;
	userId: string;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly jwtService: JwtService
	) {}

	async register(email: string, password: string): Promise<AuthResult> {
		const existingUser = await this.authRepository.findUserByEmail(email);
		if (existingUser) {
			throw new UnauthorizedException('User with this email already exists');
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = await this.authRepository.createUser(email, passwordHash);

		return this.generateAuthResult(user);
	}

	async login(email: string, password: string): Promise<AuthResult> {
		const user = await this.authRepository.findUserByEmail(email);
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.generateAuthResult(user);
	}

	async validateUser(userId: string): Promise<User | null> {
		return this.authRepository.findUserById(new UserId(userId));
	}

	private generateAuthResult(user: User): AuthResult {
		const payload: JwtPayload = {
			sub: user.id.id,
			email: user.email
		};

		return {
			accessToken: this.jwtService.sign(payload),
			userId: user.id.id
		};
	}
}
