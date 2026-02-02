import { Injectable, NotImplementedException } from '@nestjs/common';
import { Objective } from '../../domain/work/model/Objective';

@Injectable()
export class WorkOKRService {
	getObjectives(): Promise<Objective[]> {
		throw new NotImplementedException();
	}
}
