import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../../app/auth/AuthRepository';
import { User, UserId } from '../../domain/auth/model/User';
import { UserEntity } from './entity/UserEntity';
import { FirebaseAuthRepository } from './FirebaseAuthRepository';
import { DecodedIdToken } from 'firebase-admin/auth';

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
		const decodedToken =
			await this.firebaseAuthRepository.getUserIdByToken(token);

		if (decodedToken === null) {
			return null;
		}

		// TODO: Prevent race condition
		let entity = await this.userRepository.findOneBy({
			id: decodedToken.uid
		});
		if (!entity) {
			entity = this.userRepository.create({ id: decodedToken.uid });
			await this.userRepository.save(entity);
		}

		return this.toUser(entity, decodedToken);
	}

	override async removeUser(user: User): Promise<void> {
		await this.firebaseAuthRepository.removeUser(user.id.id);
		await this.userRepository.delete({
			id: user.id.id
		});
	}

	private toUser(entity: UserEntity, decodedToken: DecodedIdToken): User {
		return new User(
			new UserId(entity.id),
			decodedToken['name'] ?? null,
			decodedToken.email ?? null,
			decodedToken.picture ?? null
		);
	}
}
