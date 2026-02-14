import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRepository } from '../../app/auth/AuthRepository';
import { User, UserId } from '../../domain/auth/model/User';
import { UserEntity } from './entity/UserEntity';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {
		super();
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const entity = await this.userRepository.findOne({ where: { email } });
		if (!entity) {
			return null;
		}
		return this.toUser(entity);
	}

	async findUserById(id: UserId): Promise<User | null> {
		const entity = await this.userRepository.findOne({
			where: { id: id.id }
		});
		if (!entity) {
			return null;
		}
		return this.toUser(entity);
	}

	async createUser(email: string, passwordHash: string): Promise<User> {
		const entity = this.userRepository.create({ email, passwordHash });
		const savedEntity = await this.userRepository.save(entity);
		return this.toUser(savedEntity);
	}

	private toUser(entity: UserEntity): User {
		return new User(
			new UserId(entity.id),
			entity.email,
			entity.passwordHash
		);
	}
}
