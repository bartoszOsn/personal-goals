import { Injectable } from '@nestjs/common';
import { User, UserId } from '../../domain/auth/model/User';

@Injectable()
export class UserStorage {
	private readonly user = new User(new UserId('mock-user'));

	getUser(): Promise<User> {
		return Promise.resolve(this.user);
	}
}
