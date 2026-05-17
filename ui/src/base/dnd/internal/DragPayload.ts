const draggablePayloadKey = 'draggablePayload';

export interface DragPayload {
	[draggablePayloadKey]: unknown;
	[key: string]: unknown;
}

export function isDragPayload(value: unknown): value is DragPayload {
	return typeof value === 'object' && value !== null && draggablePayloadKey in value;
}

export function getDraggablePayload(value: DragPayload): unknown {
	return value[draggablePayloadKey];
}

export function wrapDraggablePayload(value: unknown): DragPayload {
	return {
		[draggablePayloadKey]: value,
	};
}