import { Modal, Skeleton, Stack } from '@mantine/core';

export function WorkItemModalSkeleton() {
	return (
		<>
			<Modal.Header>
				<Modal.Title>
					<Skeleton width={200} height={30} />
				</Modal.Title>
				<Modal.CloseButton />
			</Modal.Header>
			<Modal.Body>
				<Stack>
					{
						Array(5).fill(null).map((_, i) => (
							<Skeleton key={i} height={30} />
						))
					}
				</Stack>
			</Modal.Body>
		</>
	)
}