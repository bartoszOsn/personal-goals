import { YearPickerInput } from '@mantine/dates';
import { Temporal } from 'temporal-polyfill';

export function RoadmapContextSwitcher({ context, setContext }: { context: number, setContext: (context: number) => void }) {
	const value = new Temporal.PlainDate(context, 1, 1).toString();
	const onChange = (value: string | null) => {
		if (!value) return;
		const newValue = Temporal.PlainDate.from(value).year;
		setContext(newValue);
	}

	return (
		<YearPickerInput value={value}
						 onChange={onChange} />
	)
}