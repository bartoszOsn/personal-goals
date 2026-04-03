import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkItemEntity as WorkItemEntityV2 } from '../../work-item-v2/entity/WorkItemEntity';
import { SprintEntity } from '../../sprint/entity/SprintEntity';
import { DocumentEntity } from '../../document/entity/DocumentEntity';

@Entity()
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({ unique: true })
	email!: string;

	@Column()
	passwordHash!: string;

	@OneToMany(() => SprintEntity, (sprint) => sprint.user)
	sprints!: SprintEntity[];

	@OneToMany(() => WorkItemEntityV2, (workItem) => workItem.user)
	workItemsV2!: WorkItemEntityV2[];

	@OneToMany(() => DocumentEntity, (document) => document.user)
	documents!: DocumentEntity[];
}
