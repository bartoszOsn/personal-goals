import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { User, UserId } from '../../domain/auth/model/User';
import { AuthRepository } from './AuthRepository';

@Injectable({ scope: Scope.REQUEST })
export class UserStorage {
	constructor(
		@Inject(REQUEST) private readonly request: Request,
		private readonly authRepository: AuthRepository
	) {}

	async getUser(): Promise<User> {
		const userId = (this.request as any).user?.userId;
		if (!userId) {
			throw new Error('User not authenticated');
		}

		const user = await this.authRepository.findUserById(new UserId(userId));
		if (!user) {
			throw new Error('User not found');
		}

		return user;
	}
}
