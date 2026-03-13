import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { SprintSettingsEntity } from '../../time/entity/SprintSettingsEntity';
import { SprintTimeRangeEntity } from '../../time/entity/SprintTimeRangeEntity';
import { WorkItemEntity } from '../../work-item/entity/WorkItemEntity';
import { SprintEntity } from '../../sprint/entity/SprintEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@OneToMany(() => SprintEntity, (sprint) => sprint.user)
	sprints: SprintEntity[];

	@OneToOne(() => SprintSettingsEntity, (settings) => settings.user)
	sprintSettings?: SprintSettingsEntity;

	@OneToMany(() => WorkItemEntity, (workItem) => workItem.user)
	workItems: WorkItemEntity[];
}
