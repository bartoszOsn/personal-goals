import { ActionIcon, Box, Group, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import type { ColumnDescriptor } from '@/base/data-table/api/ColumnDescriptor';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export interface DataTableCustomizationPopoverProps<TData> {
	allPossibleColumns: ColumnDescriptor<TData, unknown>[];
	visibleColumns: ColumnDescriptor<TData, unknown>[];
	setColumns: (columns: ColumnDescriptor<TData, unknown>[]) => void;
}

export function DataTableCustomizationPopover<TData>(props: DataTableCustomizationPopoverProps<TData>) {
	const visible = props.allPossibleColumns.filter(c => props.visibleColumns.includes(c));
	const hidden = props.allPossibleColumns.filter(c => !props.visibleColumns.includes(c));

	const showColumn = (column: ColumnDescriptor<TData, unknown>) => {
		props.setColumns([...props.visibleColumns, column]);
	};

	const hideColumn = (column: ColumnDescriptor<TData, unknown>) => {
		props.setColumns(props.visibleColumns.filter(c => c !== column));
	};

	return (
		<ScrollArea.Autosize scrollbars='xy' miw={200} mah={300}>
			<Box>
				<Text fw="bold" mb="xs" size='sm' c="dimmed">Visible columns</Text>
				<Stack gap={2} mb="md">
					{
						visible.map(c => (
							<Group justify="space-between">
								<Text size='sm'>{c.columnName}</Text>
								<Tooltip label="Click to hide">
									<ActionIcon size="sm" color="gray" variant="subtle" onClick={() => hideColumn(c)}>
										<IconEyeOff size={12} />
									</ActionIcon>
								</Tooltip>
							</Group>
						))
					}
				</Stack>
				<Text fw="bold" mb="xs" size='sm' c="dimmed">Hidden columns</Text>
				<Stack>
					{
						hidden.map(c => (
							<Group justify="space-between">
								<Text size='sm'>{c.columnName}</Text>
								<Tooltip label="Click to show">
									<ActionIcon size="sm" color="gray" variant="subtle" onClick={() => showColumn(c)}>
										<IconEye size={12} />
									</ActionIcon>
								</Tooltip>
							</Group>
						))
					}
				</Stack>
			</Box>
		</ScrollArea.Autosize>
	);
}