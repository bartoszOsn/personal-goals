import { RichText } from './RichText';
import { KeyResultProgress } from './KeyResultProgress';

export class KeyResultRequest {
	constructor(
		public readonly name: string | null,
		public readonly description: RichText | null,
		public readonly progress: KeyResultProgress | null
	) {}
}
