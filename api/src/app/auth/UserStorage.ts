import { Injectable } from '@nestjs/common';
import { User } from '../../domain/auth/model/User';

@Injectable()
export abstract class UserStorage {
	abstract getUser(): Promise<User>;
}
