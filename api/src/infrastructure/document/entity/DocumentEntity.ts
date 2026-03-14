import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from '../../auth/entity/UserEntity';

@Entity()
export class DocumentEntity {
	@PrimaryColumn('uuid')
	id: string;

	@Column()
	context: number;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	updatedAt: string;

	@ManyToOne(() => UserEntity, (user) => user.documents)
	user: UserEntity;
}
