import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStorage } from './UserStorage';
import { User } from '../../domain/auth/model/User';

// TODO: Make this class use async storage.
@Injectable()
export class UserStorageImpl extends UserStorage {
	private user: User | null = null;

	setUser(user: User) {
		this.user = user;
	}

	override getUser(): Promise<User> {
		if (!this.user) {
			throw new UnauthorizedException('No user found');
		}

		return Promise.resolve(this.user);
	}
}
