import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStorage } from './UserStorage';
import { User } from '../../domain/auth/model/User';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class UserStorageImpl extends UserStorage {
	constructor(private readonly clsService: ClsService<{ user: User }>) {
		super();
	}

	setUser(user: User) {
		this.clsService.set('user', user);
	}

	override getUser(): Promise<User> {
		const user = this.clsService.get('user');
		if (!user) {
			throw new UnauthorizedException('No user found');
		}

		return Promise.resolve(user);
	}
}
