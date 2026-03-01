import { YearPickerInput } from '@mantine/dates';
import { Group, Input, Select } from '@mantine/core';
import { ObjectiveDeadline } from '@/models/Objective';

export interface ObjectiveDeadlinePickerProps {
	value?: ObjectiveDeadline;
	onChange?: (value?: ObjectiveDeadline) => void;
	label?: string;
}

export function ObjectiveDeadlinePicker(props: ObjectiveDeadlinePickerProps) {
	const value = props.value ? props.value?.year + '-01-01' : undefined;
	console.log(props.value?.year, value)

	return (
		<Input.Wrapper label={props.label}>
				<Group gap='xs'>
					<YearPickerInput
						valueFormat='YYYY'
						value={value }
						flex={1}
						placeholder='Year'
						onChange={(year) => year !== null && props.onChange?.({ quarter: null, ...props.value, year: new Date(year).getUTCFullYear() })}
					/>
					<Select
							data={['Q1', 'Q2', 'Q3', 'Q4']}
							value={props.value?.quarter}
							onChange={(quarter) => quarter && props.onChange?.({ ...props.value, quarter } as any)}
							disabled={!props.value}
							clearable
							placeholder="Quarter" />
				</Group>
		</Input.Wrapper>

	);
}

