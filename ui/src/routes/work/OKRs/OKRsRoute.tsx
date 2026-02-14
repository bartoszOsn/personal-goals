import { useOkrQuery } from '@/api/okr-hooks';
import { Stack } from '@mantine/core';
import { OKRs } from '@/routes/work/OKRs/OKRs';

export function OKRsRoute() {
	const okrs = useOkrQuery();

	if (okrs.isPending || !okrs.data) {
		return <div>Loading...</div>;
	}



	return (
		<Stack p="lg">
			<OKRs />
		</Stack>
	)
}