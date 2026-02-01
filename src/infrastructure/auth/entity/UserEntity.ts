import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;
}
