import { WorkItem, WorkItemTimeFrame, WorkItemTimeFrameType, WorkItemUpdateRequest } from '@/models/WorkItem.ts';
import { Accordion, Button, Checkbox, Group, Loader, Radio, Select, Stack, Text, UnstyledButton } from '@mantine/core';
import { ComponentProps, useMemo, useState } from 'react';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { useModals } from '@mantine/modals';
import { Quarter } from '@/models/Quarter';
import { Temporal } from 'temporal-polyfill';
import { DatePickerInput } from '@mantine/dates';
import { Sprint } from '@/models/Sprint';
import { useSprintQuery } from '@/api/sprint/sprint-hooks';
import { getSprintName } from '@/core/getSprintName';
import { useUpdateWorkItemMutation } from '@/api/work-item/work-item-hooks';

export interface WorkItemTimeFrameInplaceProps {
	workItem: WorkItem;
	displayButtonProps?: ComponentProps<typeof UnstyledButton>;
}

const modalId = 'work-item-time-frame-inplace';

export function WorkItemTimeFrameInplace(props: WorkItemTimeFrameInplaceProps) {
	const modals = useModals();

	const openModal = () => {
		modals.openModal({
			title: 'Time frame',
			children: <TimeFrameModal {...props} />,
			styles: {
				body: {
					paddingBottom: 0
				}
			},
			id: modalId
		});
	};

	return (
		<UnstyledButton onClick={openModal}>
			<TimeFrameDisplay {...props} />
		</UnstyledButton>
	);
}

function TimeFrameDisplay(props: WorkItemTimeFrameInplaceProps) {
	const sprints = useSprintQuery(props.workItem.contextYear);

	const sprint = sprints.data?.find(sprint => props.workItem.timeFrame?.type === WorkItemTimeFrameType.SPRINT && props.workItem.timeFrame.sprintId === sprint.id);
	const sprintName = sprint ? getSprintName(sprint) : undefined;

	if (props.workItem.timeFrame === null) {
		return <Text c="dimmed" size='sm'>No time frame</Text>;
	}

	return <Text size='sm' style={{ textWrap: 'nowrap' }}>
		{props.workItem.timeFrame.startDate.toLocaleString()}
		{' '}<IconArrowNarrowRight size={12} />{' '}
		{props.workItem.timeFrame.endDate.toLocaleString()}

		{
			props.workItem.timeFrame.type === WorkItemTimeFrameType.WHOLE_YEAR &&
			<Text span inherit c="dimmed"> ({props.workItem.contextYear})</Text>
		}
		{
			props.workItem.timeFrame.type === WorkItemTimeFrameType.QUARTER &&
			<Text span c="dimmed"> ({props.workItem.timeFrame.quarter})</Text>
		}
		{
			props.workItem.timeFrame.type === WorkItemTimeFrameType.CUSTOM_DATE &&
			<Text span c="dimmed"> (Custom)</Text>
		}
		{
			props.workItem.timeFrame.type === WorkItemTimeFrameType.SPRINT && sprintName &&
			<Text span c="dimmed"> ({sprintName})</Text>
		}
	</Text>
}

function TimeFrameModal(props: WorkItemTimeFrameInplaceProps) {
	const sprintsQuery = useSprintQuery(props.workItem.contextYear);

	if (sprintsQuery.isLoading || !sprintsQuery.data) {
		return <Loader />;
	}

	return <TimeFrameModalContent {...props} sprints={sprintsQuery.data} />;
}

function TimeFrameModalContent(props: WorkItemTimeFrameInplaceProps & { sprints: Sprint[] }) {
	const updateWorkItemMutation = useUpdateWorkItemMutation();
	const modalContext = useModals();
	const [type, setType] = useState<WorkItemTimeFrameType | 'no-date'>(props.workItem.timeFrame?.type ?? 'no-date');
	const [quarter, setQuarter] = useState<Quarter>(
		props.workItem.timeFrame?.type === WorkItemTimeFrameType.QUARTER
			? props.workItem.timeFrame?.quarter
			: Quarter.Q1
	);
	const [startDate, setStartDate] = useState<Temporal.PlainDate>(props.workItem.timeFrame?.startDate ?? Temporal.Now.plainDateISO());
	const [endDate, setEndDate] = useState<Temporal.PlainDate>(props.workItem.timeFrame?.endDate ?? Temporal.Now.plainDateISO());
	const [sprint, setSprint] = useState<Sprint>(
		props.sprints.find(s => props.workItem.timeFrame?.type === WorkItemTimeFrameType.SPRINT && s.id === props.workItem.timeFrame?.sprintId) ?? props.sprints[0]
	);

	const request: WorkItemUpdateRequest = useMemo(() => {
		let timeFrame: WorkItemTimeFrame | null = null;

		if (type === 'no-date') {
			timeFrame = null;
		} else if (type === WorkItemTimeFrameType.WHOLE_YEAR) {
			timeFrame = {
				type: WorkItemTimeFrameType.WHOLE_YEAR,
				context: props.workItem.contextYear,
				startDate: startDate,
				endDate: endDate
			};
		} else if (type === WorkItemTimeFrameType.QUARTER) {
			timeFrame = {
				type: WorkItemTimeFrameType.QUARTER,
				context: props.workItem.contextYear,
				startDate: startDate,
				endDate: endDate,
				quarter: quarter
			};
		} else if (type === WorkItemTimeFrameType.CUSTOM_DATE) {
			timeFrame = {
				type: WorkItemTimeFrameType.CUSTOM_DATE,
				context: props.workItem.contextYear,
				startDate: startDate,
				endDate: endDate
			}
		} else if (type === WorkItemTimeFrameType.SPRINT) {
			timeFrame = {
				type: WorkItemTimeFrameType.SPRINT,
				context: props.workItem.contextYear,
				startDate: startDate,
				endDate: endDate,
				sprintId: sprint.id
			}
		} else {
			throw new Error('Invalid time frame type')
		}

		return {
			timeFrame: timeFrame
		}
	}, [endDate, props.workItem.contextYear, quarter, sprint.id, startDate, type])

	const onSave = () => {
		updateWorkItemMutation.mutateAsync({
			id: props.workItem.id,
			request: request
		}).then(() => {
			const modalToClose = modalContext.modals.find(modal => modal.props.id === modalId);
			if (modalToClose) {
				modalContext.closeModal(modalToClose.id);
			}
		})
	}

	return (
		<Stack>
			<Accordion value={type} onChange={(value => value && setType(value as WorkItemTimeFrameType | 'no-date'))}>
				<Accordion.Item value={'no-date'}>
					<Accordion.Control icon={<Checkbox.Indicator checked={type === 'no-date'} />}>No time frame</Accordion.Control>
					<Accordion.Panel>
						<Text c="dimmed">No time frame</Text>
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value={WorkItemTimeFrameType.WHOLE_YEAR}>
					<Accordion.Control icon={<Checkbox.Indicator checked={type === WorkItemTimeFrameType.WHOLE_YEAR} />}>Whole year</Accordion.Control>
					<Accordion.Panel>
						<Text c="dimmed">Time frame spanning whole year</Text>
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value={WorkItemTimeFrameType.QUARTER}>
					<Accordion.Control icon={<Checkbox.Indicator checked={type === WorkItemTimeFrameType.QUARTER} />}>Quarter</Accordion.Control>
					<Accordion.Panel>
						<Radio.Group label="Select Quarter" value={quarter} onChange={(value) => setQuarter(value as Quarter)}>
							<Group mt="xs">
								<Radio value={Quarter.Q1} label="Q1" />
								<Radio value={Quarter.Q2} label="Q2" />
								<Radio value={Quarter.Q3} label="Q3" />
								<Radio value={Quarter.Q4} label="Q4" />
							</Group>
						</Radio.Group>
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value={WorkItemTimeFrameType.CUSTOM_DATE}>
					<Accordion.Control icon={<Checkbox.Indicator checked={type === WorkItemTimeFrameType.CUSTOM_DATE} />}>Custom dates</Accordion.Control>
					<Accordion.Panel>
						<Group mt="xs">
							<DatePickerInput flex={1} label="Start date" value={startDate.toJSON()}
											 onChange={v => v && setStartDate(Temporal.PlainDate.from(v))} />
							<DatePickerInput flex={1} label="End date" value={endDate.toJSON()} onChange={v => v && setEndDate(Temporal.PlainDate.from(v))} />
						</Group>
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value={WorkItemTimeFrameType.SPRINT}>
					<Accordion.Control icon={<Checkbox.Indicator checked={type === WorkItemTimeFrameType.SPRINT} />}>Sprint</Accordion.Control>
					<Accordion.Panel>
						<Select value={sprint.id}
								data={props.sprints.map(sprint => ({ label: getSprintName(sprint), value: sprint.id }))}
								onChange={id => setSprint(props.sprints.find(s => s.id === id)!)} />
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
			<Group pos="sticky" bg="white" pb="md" pt="xs" bottom={0}>
				<Button loading={updateWorkItemMutation.isPending} onClick={onSave}>Save</Button>
			</Group>
		</Stack>
	);
}