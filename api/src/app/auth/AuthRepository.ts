import { User, UserId } from '../../domain/auth/model/User';

export abstract class AuthRepository {
	abstract findUserByEmail(email: string): Promise<User | null>;
	abstract findUserById(id: UserId): Promise<User | null>;
	abstract createUser(email: string, passwordHash: string): Promise<User>;
}
