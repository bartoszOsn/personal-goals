import { Injectable } from '@nestjs/common';
import { AuthRepository } from './AuthRepository';
import { UserStorageImpl } from './UserStorageImpl';

@Injectable()
export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly userStorageImpl: UserStorageImpl
	) {}

	async validateToken(token: string): Promise<boolean> {
		const user = await this.authRepository.getUserByJwt(token);

		if (!user) {
			return false;
		}

		this.userStorageImpl.setUser(user);
		return true;
	}
}
