import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { UserStorage } from './UserStorage';
import { AuthService } from './AuthService';
import { UserStorageImpl } from './UserStorageImpl';

@Global()
@Module({
	providers: [
		UserStorageImpl,
		{ provide: UserStorage, useExisting: UserStorageImpl },
		AuthService
	],
	exports: [UserStorage, AuthService]
})
export class AuthAppModule {
	static withRepositories(repositoryModule: Type): DynamicModule {
		return {
			module: AuthAppModule,
			imports: [repositoryModule]
		};
	}
}
