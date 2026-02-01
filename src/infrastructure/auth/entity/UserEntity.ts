import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { RestPeriodEntity } from '../../time/entity/RestPeriodEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;

	@OneToMany(() => RestPeriodEntity, (entity) => entity.user)
	restPeriods: RestPeriodEntity[];
}
