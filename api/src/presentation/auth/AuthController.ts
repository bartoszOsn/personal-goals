import { Controller, Delete, Get } from '@nestjs/common';
import { UserDTO } from '@personal-okr/shared';
import { UserStorage } from '../../app/auth/UserStorage';
import { User } from '../../domain/auth/model/User';
import { AuthService } from '../../app/auth/AuthService';

@Controller('user-info')
export class AuthController {
	constructor(
		private readonly userStorage: UserStorage,
		private readonly authService: AuthService
	) {}

	@Get()
	async getUserInfo(): Promise<UserDTO> {
		const user = await this.userStorage.getUser();
		return this.toDTO(user);
	}

	@Delete()
	async deleteUser(): Promise<void> {
		await this.authService.deleteUser();
	}

	private toDTO(user: User): UserDTO {
		return {
			displayName: user.displayName ?? undefined,
			email: user.email ?? undefined,
			picture: user.picture ?? undefined
		};
	}
}
