import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../app/auth/AuthService';
import {
	LoginRequestDTO,
	RegisterRequestDTO,
	AuthResponseDTO
} from '@personal-okr/shared';
import { Public } from './decorators/Public';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	async register(
		@Body() request: RegisterRequestDTO
	): Promise<AuthResponseDTO> {
		const result = await this.authService.register(
			request.email,
			request.password
		);
		return {
			accessToken: result.accessToken,
			userId: result.userId
		};
	}

	@Public()
	@Post('login')
	async login(@Body() request: LoginRequestDTO): Promise<AuthResponseDTO> {
		const result = await this.authService.login(
			request.email,
			request.password
		);
		return {
			accessToken: result.accessToken,
			userId: result.userId
		};
	}
}
