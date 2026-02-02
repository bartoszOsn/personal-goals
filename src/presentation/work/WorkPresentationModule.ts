import { Module } from '@nestjs/common';
import { WorkPresentationOKRController } from './WorkPresentationOKRController';

@Module({
	controllers: [WorkPresentationOKRController]
})
export class WorkPresentationModule {}
