import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../../app/auth/AuthRepository';
import { User, UserId } from '../../domain/auth/model/User';
import { UserEntity } from './entity/UserEntity';
import { FirebaseAuthRepository } from './FirebaseAuthRepository';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly firebaseAuthRepository: FirebaseAuthRepository
	) {
		super();
	}

	override async getUserByJwt(token: string): Promise<User | null> {
		const id = await this.firebaseAuthRepository.getUserIdByToken(token);

		if (id === null) {
			return null;
		}

		let entity = await this.userRepository.findOneBy({ id });
		if (!entity) {
			entity = this.userRepository.create({ id });
			await this.userRepository.save(entity);
		}

		return this.toUser(entity);
	}

	private toUser(entity: UserEntity): User {
		return new User(new UserId(entity.id));
	}
}
