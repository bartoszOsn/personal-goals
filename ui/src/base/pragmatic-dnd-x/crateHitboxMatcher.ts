import { Input } from '@atlaskit/pragmatic-drag-and-drop/types';

export type HitboxOffset = { px: number } | { percent: number } | 0;

export interface HitboxDefinition {
	top: HitboxOffset;
	left: HitboxOffset;
	right: HitboxOffset;
	bottom: HitboxOffset;
}

export function createHitboxMatcher<THitboxName extends string>(
	hitboxes: Record<THitboxName, HitboxDefinition>
): (element: Element, input: Input) => THitboxName | null {
	const hitboxMap = new Map<THitboxName, HitboxDefinition>(
		Object.entries(hitboxes) as [THitboxName, HitboxDefinition][]
	);

	return (element, input) => {
		const elementRect = element.getBoundingClientRect();

		for (const [hitboxName, hitboxDefinition] of hitboxMap) {
			if (isInsideHitbox(hitboxDefinition, elementRect, input)) {
				return hitboxName;
			}
		}

		return null;
	}
}

function isInsideHitbox(hitboxDefinition: HitboxDefinition, elementRect: DOMRect, input: Input) {
	const top = resolveOffsetToPx(hitboxDefinition.top, elementRect.height);
	const bottom = resolveOffsetToPx(hitboxDefinition.bottom, elementRect.height);
	const left = resolveOffsetToPx(hitboxDefinition.left, elementRect.width);
	const right = resolveOffsetToPx(hitboxDefinition.right, elementRect.width);

	const insideOnXAxis = input.clientX >= left && input.clientX <= right;
	const insideOnYAxis = input.clientY >= top && input.clientY <= bottom;

	return insideOnXAxis && insideOnYAxis;
}

function resolveOffsetToPx(offset: HitboxOffset, full: number): number {
	if (offset === 0) {
		return 0;
	}

	if ('px' in offset) {
		return offset.px;
	}

	if ('percent' in offset) {
		return offset.percent * full / 100;
	}

	return 0;
}