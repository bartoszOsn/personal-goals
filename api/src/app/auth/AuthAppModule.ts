import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserStorage } from './UserStorage';
import { AuthService } from './AuthService';

@Global()
@Module({
	imports: [
		JwtModule.register({
			secret: process.env['JWT_SECRET'] || 'your-secret-key', // TODO: Move to config
			signOptions: { expiresIn: '7d' }
		})
	],
	providers: [UserStorage, AuthService],
	exports: [UserStorage, AuthService, JwtModule]
})
export class AuthAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: AuthAppModule,
			imports: [
				JwtModule.register({
					secret: process.env['JWT_SECRET'] || 'your-secret-key',
					signOptions: { expiresIn: '7d' }
				}),
				repositoryModule
			]
		};
	}
}
