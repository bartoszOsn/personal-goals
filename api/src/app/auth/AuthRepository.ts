import { User } from '../../domain/auth/model/User';

export abstract class AuthRepository {
	abstract getUserByJwt(token: string): Promise<User | null>;
	abstract removeUser(user: User): Promise<void>;
}
