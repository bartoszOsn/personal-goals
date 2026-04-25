import { Controller, Delete } from '@nestjs/common';
import { AuthService } from '../../app/auth/AuthService';

@Controller('user-info')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Delete()
	async deleteUser(): Promise<void> {
		await this.authService.deleteUser();
	}
}
