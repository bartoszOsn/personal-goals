import { Global, Module } from '@nestjs/common';
import { UserStorage } from './UserStorage';

// TODO: Do something better when auth bounded context
//  stops being just a placeholder for future implementation.
@Global()
@Module({
	providers: [UserStorage],
	exports: [UserStorage]
})
export class AuthAppModule {}
