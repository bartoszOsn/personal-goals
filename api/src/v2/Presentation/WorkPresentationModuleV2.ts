import { Module } from '@nestjs/common';
import { WorkItemController } from './WorkItemController';

@Module({
	controllers: [WorkItemController]
})
export class PresentationModuleV2 {}
