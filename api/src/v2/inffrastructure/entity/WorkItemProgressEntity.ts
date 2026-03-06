import { Column } from 'typeorm';

export class WorkItemProgressEntity {
	@Column({
		enum: ['manual', 'childrenProgressBased', 'ChildrenStatusBased']
	})
	type: 'manual' | 'childrenProgressBased' | 'ChildrenStatusBased';

	@Column({ nullable: true })
	manualProgress: number;
}
