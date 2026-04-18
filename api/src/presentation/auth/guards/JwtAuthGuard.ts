import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/Public';
import { CanActivate } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../../app/auth/AuthService';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private authService: AuthService
	) {}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()]
		);
		if (isPublic) {
			return true;
		}

		return this.validateJwt(context);
	}

	private async validateJwt(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();
		const authorization = request.headers.authorization;

		if (!authorization) {
			return false;
		}

		return this.authService.validateToken(authorization);
	}
}
